// Permission Service - handles system permission requests

export class PermissionService {
  async requestFileSystemPermission(): Promise<boolean> {
    try {
      // Check if File System Access API is available
      if ('showDirectoryPicker' in window) {
        return true;
      }
      // Fallback for browsers without File System Access API
      return true;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  async checkStoragePermission(): Promise<boolean> {
    if (navigator.storage && navigator.storage.persist) {
      const persistent = await navigator.storage.persist();
      return persistent;
    }
    return true;
  }

  async requestMediaPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  }
}

export const permissionService = new PermissionService();