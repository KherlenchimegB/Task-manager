// frontend/src/hooks/useNotifications.ts
export const useNotifications = () => {
    const requestPermission = async () => {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    };
  
    const sendNotification = (title: any, options = {}) => {
      if (Notification.permission === 'granted') {
        new Notification(title, options);
      }
    };
  
    return { requestPermission, sendNotification };
  };