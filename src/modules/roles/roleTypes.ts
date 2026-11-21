export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'manage';

export interface ModulePermission {
  moduleKey: string;
  moduleName: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  manage: boolean;
}

export interface SystemRole {
  id: string;
  name: string;
  description: string;
  userCount: number;
  isSystemProtected?: boolean; // Super Admin cannot be modified
  category: 'Platform' | 'Tenant Admin' | 'Field Operations' | 'Back Office';
  permissions: ModulePermission[];
}
