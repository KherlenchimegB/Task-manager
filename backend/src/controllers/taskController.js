import { prisma } from "../server.js";

// Get all tasks for a project
export const getTasks = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const { filter } = req.query; // all, active, completed

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user.id,
      },
    });

    if (!project) {
      return res.status(404).json({
        error: "Not found",
        message: "Project not found or access denied",
      });
    }

    // Build filter conditions
    let whereConditions = { projectId };

    if (filter === "active") {
      whereConditions.completed = false;
    } else if (filter === "completed") {
      whereConditions.completed = true;
    }

    const tasks = await prisma.task.findMany({
      where: whereConditions,
      orderBy: [
        { completed: "asc" }, // Pending tasks first
        { priority: "desc" }, // High priority first
        { createdAt: "desc" },
      ],
    });

    res.json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      error: "Fetch failed",
      message: "Unable to fetch tasks",
    });
  }
};

// Create new task
export const createTask = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const { title, description, priority, dueDate } = req.body;

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user.id,
      },
    });

    if (!project) {
      return res.status(404).json({
        error: "Not found",
        message: "Project not found or access denied",
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
      },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      error: "Creation failed",
      message: "Unable to create task",
    });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { title, description, completed, priority, dueDate } = req.body;

    // Verify task belongs to user (through project)
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId },
      include: {
        project: {
          select: { userId: true },
        },
      },
    });

    if (!existingTask || existingTask.project.userId !== req.user.id) {
      return res.status(404).json({
        error: "Not found",
        message: "Task not found or access denied",
      });
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description: description || null }),
        ...(completed !== undefined && { completed }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
      },
    });

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      error: "Update failed",
      message: "Unable to update task",
    });
  }
};

// Toggle task completion
export const toggleTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    // Verify task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId },
      include: {
        project: {
          select: { userId: true },
        },
      },
    });

    if (!existingTask || existingTask.project.userId !== req.user.id) {
      return res.status(404).json({
        error: "Not found",
        message: "Task not found or access denied",
      });
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: !existingTask.completed,
      },
    });

    res.json({
      message: `Task ${task.completed ? "completed" : "reopened"} successfully`,
      task,
    });
  } catch (error) {
    console.error("Toggle task error:", error);
    res.status(500).json({
      error: "Update failed",
      message: "Unable to update task",
    });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    // Verify task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId },
      include: {
        project: {
          select: { userId: true },
        },
      },
    });

    if (!existingTask || existingTask.project.userId !== req.user.id) {
      return res.status(404).json({
        error: "Not found",
        message: "Task not found or access denied",
      });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      error: "Deletion failed",
      message: "Unable to delete task",
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get comprehensive statistics
    const [
      totalProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      todayTasks,
      recentTasks,
    ] = await Promise.all([
      // Count total projects
      prisma.project.count({
        where: { userId },
      }),

      // Count total tasks
      prisma.task.count({
        where: {
          project: { userId },
        },
      }),

      // Count completed tasks
      prisma.task.count({
        where: {
          project: { userId },
          completed: true,
        },
      }),

      // Count overdue tasks
      prisma.task.count({
        where: {
          project: { userId },
          completed: false,
          dueDate: {
            lt: new Date(),
          },
        },
      }),

      // Count tasks due today
      prisma.task.count({
        where: {
          project: { userId },
          completed: false,
          dueDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),

      // Get recent tasks (last 5)
      prisma.task.findMany({
        where: {
          project: { userId },
        },
        include: {
          project: {
            select: { name: true, color: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const completionRate =
      totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    res.json({
      stats: {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
        overdueTasks,
        todayTasks,
        completionRate: parseFloat(completionRate),
      },
      recentTasks,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      error: "Fetch failed",
      message: "Unable to fetch dashboard statistics",
    });
  }
};
