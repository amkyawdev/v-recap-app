import { usePermissions } from '../contexts/PermissionContext';

export const useVideoEditing = () => {
  const { hasPermission, folderName } = usePermissions();

  const canEdit = () => {
    return hasPermission && folderName.length > 0;
  };

  return {
    canEdit,
    hasPermission,
    folderName
  };
};