import { prisma } from "../server.js";

// Get all projects for the authenticated user
export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
      include: {
        _count: {
          select: {
            tasks: true, // Count total tasks
            tasks: { where: { completed: true } }, // This won't work as expected
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate task counts manually for better accuracy
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await prisma.task.count({
          where: { projectId: project.id },
        });

        const completedTasks = await prisma.task.count({
          where: {
            projectId: project.id,
            completed: true,
          },
        });

        return {
          ...project,
          taskCount: {
            total: totalTasks,
            completed: completedTasks,
            pending: totalTasks - completedTasks,
          },
        };
      })
    );

    res.json({ projects: projectsWithCounts });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({
      error: "Fetch failed",
      message: "Unable to fetch projects",
    });
  }
};

// Get single project with tasks
export const getProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user.id, // Ensure user owns this project
      },
      include: {
        tasks: {
          orderBy: [
            { completed: "asc" }, // Show pending tasks first
            { createdAt: "desc" },
          ],
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        error: "Not found",
        message: "Project not found or access denied",
      });
    }

    res.json({ project });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({
      error: "Fetch failed",
      message: "Unable to fetch project",
    });
  }
};

// Create new project
export const createProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        color: color || "#3B82F6",
        userId: req.user.id,
      },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({
      error: "Creation failed",
      message: "Unable to create project",
    });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const { name, description, color } = req.body;

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user.id,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        error: "Not found",
        message: "Project not found or access denied",
      });
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description: description || null,
        color: color || existingProject.color,
      },
    });

    res.json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({
      error: "Update failed",
      message: "Unable to update project",
    });
  }
};

// Delete project and all its tasks
export const deleteProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user.id,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        error: "Not found",
        message: "Project not found or access denied",
      });
    }

    // Delete project (tasks will be deleted automatically due to CASCADE)
    await prisma.project.delete({
      where: { id: projectId },
    });

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      error: "Deletion failed",
      message: "Unable to delete project",
    });
  }
};
