import React, { useState, useMemo } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { SearchBar } from '../../components/common/SearchBar';
import { RoleFormModal } from './RoleFormModal';
import { SystemRole, PermissionAction } from './roleTypes';
import { MOCK_ROLES } from './roleData';
import { getBreadcrumbs } from '../../app/navigation';
import { 
  Plus, 
  Copy, 
  Edit3, 
  Lock, 
  Save, 
  Check, 
  Users
} from 'lucide-react';

interface RolesPermissionsProps {
  onShowToast: (msg: string) => void;
}

export const RolesPermissions: React.FC<RolesPermissionsProps> = ({ onShowToast }) => {
  const [roles, setRoles] = useState<SystemRole[]>(MOCK_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(MOCK_ROLES[1].id); // Default to Tenant Admin
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<SystemRole | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const selectedRole = useMemo(() => {
    return roles.find(r => r.id === selectedRoleId) || roles[0];
  }, [roles, selectedRoleId]);

  const filteredRoles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return roles;
    return roles.filter(r => 
      r.name.toLowerCase().includes(q) || 
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  }, [roles, searchQuery]);

  const handleTogglePermission = (moduleKey: string, action: PermissionAction) => {
    if (selectedRole.isSystemProtected) {
      onShowToast('Super Admin role permissions are root-protected and cannot be downgraded.');
      return;
    }

    setRoles(prev => prev.map(role => {
      if (role.id === selectedRole.id) {
        const updatedPerms = role.permissions.map(p => {
          if (p.moduleKey === moduleKey) {
            return { ...p, [action]: !p[action] };
          }
          return p;
        });
        return { ...role, permissions: updatedPerms };
      }
      return role;
    }));
    setHasUnsavedChanges(true);
  };

  const handleSavePermissions = () => {
    setHasUnsavedChanges(false);
    onShowToast(`Permission matrix saved successfully for "${selectedRole.name}".`);
  };

  const handleDuplicateRole = (role: SystemRole) => {
    const newId = `role-${role.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-copy-${Date.now().toString().slice(-4)}`;
    const clonedRole: SystemRole = {
      ...role,
      id: newId,
      name: `${role.name} (Custom)`,
      description: `Cloned variant based on ${role.name}.`,
      userCount: 0,
      isSystemProtected: false,
    };
    setRoles(prev => [...prev, clonedRole]);
    setSelectedRoleId(newId);
    onShowToast(`Duplicated role "${clonedRole.name}" successfully created.`);
  };

  const handleSaveRoleMeta = (roleMeta: Partial<SystemRole>) => {
    if (roleToEdit) {
      setRoles(prev => prev.map(r => r.id === roleToEdit.id ? { ...r, ...roleMeta } as SystemRole : r));
      onShowToast(`Role "${roleMeta.name}" updated.`);
    } else {
      const newRole = roleMeta as SystemRole;
      setRoles(prev => [...prev, newRole]);
      setSelectedRoleId(newRole.id);
      onShowToast(`Custom role "${newRole.name}" created.`);
    }
    setRoleToEdit(null);
  };

  return (
    <PageLayout
      title="Roles & Permissions"
      scriptTagline="Role-based access control & granular authorization"
      description="Configure role boundaries, inspect the multi-action privilege matrix across the six business engines, and enforce architectural tenant isolation."
      breadcrumbs={getBreadcrumbs('roles')}
      actions={
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#765087] hover:bg-[#684577] text-white text-xs font-semibold shadow-subtle hover:shadow-card transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>Create Role</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Role Directory (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E7E5E9]/80 shadow-subtle space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E5E9]/60">
              <span className="text-[10px] uppercase font-bold text-[#77727D] font-display">
                Configured Roles ({roles.length})
              </span>
              <span className="text-xs text-[#765087] font-semibold">
                8 Standard Tiers
              </span>
            </div>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search roles..."
              className="w-full"
            />

            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredRoles.map((role) => {
                const isSelected = role.id === selectedRoleId;

                return (
                  <div
                    key={role.id}
                    onClick={() => {
                      setSelectedRoleId(role.id);
                      setHasUnsavedChanges(false);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#F0E6F5]/80 border-[#9662AD] shadow-subtle'
                        : 'bg-[#FAF9FB] hover:bg-white border-[#E7E5E9]/80 text-[#17151A]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-[#17151A]">
                          {role.name}
                        </span>
                        {role.isSystemProtected && (
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#17151A] text-white text-[9px] font-semibold">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Protected</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#77727D] font-medium flex items-center space-x-1">
                        <Users className="w-3 h-3 text-[#9E9AA3]" />
                        <span>{role.userCount}</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-[#77727D] line-clamp-2 mt-1">
                      {role.description}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E7E5E9]/50 text-[10px] text-[#77727D]">
                      <span className="uppercase font-semibold tracking-wider text-[9px] text-[#765087]">
                        {role.category}
                      </span>
                      <span>
                        {role.permissions.filter(p => p.view || p.manage).length} active scopes
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Permission Matrix (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-[#E7E5E9]/80 shadow-subtle space-y-6">
          
          {/* Header of selected role */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E5E9]/80">
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="font-display font-bold text-xl text-[#17151A]">
                  {selectedRole.name}
                </h3>
                {selectedRole.isSystemProtected ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#17151A] text-white flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Root Platform Protected</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0E6F5] text-[#765087]">
                    Customizable Role
                  </span>
                )}
              </div>
              <p className="text-xs text-[#77727D] mt-1 max-w-xl">
                {selectedRole.description}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleDuplicateRole(selectedRole)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[#E7E5E9] text-xs font-semibold text-[#17151A] hover:bg-[#F3F3F5] transition-colors"
                title="Clone this role configuration"
              >
                <Copy className="w-3.5 h-3.5 text-[#765087]" />
                <span>Duplicate</span>
              </button>

              {!selectedRole.isSystemProtected && (
                <button
                  type="button"
                  onClick={() => setRoleToEdit(selectedRole)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[#E7E5E9] text-xs font-semibold text-[#17151A] hover:bg-[#F3F3F5] transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#77727D]" />
                  <span>Edit Info</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSavePermissions}
                disabled={selectedRole.isSystemProtected}
                className={`inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white shadow-subtle transition-all ${
                  selectedRole.isSystemProtected
                    ? 'bg-[#E7E5E9] text-[#9E9AA3] cursor-not-allowed'
                    : hasUnsavedChanges
                    ? 'bg-[#9662AD] hover:bg-[#765087] animate-pulse'
                    : 'bg-[#765087] hover:bg-[#684577]'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{hasUnsavedChanges ? 'Save Changes' : 'Saved'}</span>
              </button>
            </div>
          </div>

          {/* System Protection Warning Notice */}
          {selectedRole.isSystemProtected && (
            <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#FAF9FB] border border-[#E7E5E9] text-xs text-[#77727D]">
              <Lock className="w-4 h-4 text-[#765087] flex-shrink-0" />
              <span>
                <strong>System Protected Role:</strong> The Super Admin role maintains immutable full-access privileges across all current and future platform microservices. Tenant administrators cannot alter these flags.
              </span>
            </div>
          )}

          {/* Granular Permission Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E7E5E9]/80 text-[#77727D] font-display font-medium text-[11px] uppercase tracking-wider bg-[#FAF9FB]">
                  <th className="px-4 py-3 rounded-l-xl">Business Engine / Scope</th>
                  <th className="px-4 py-3 text-center">View</th>
                  <th className="px-4 py-3 text-center">Create</th>
                  <th className="px-4 py-3 text-center">Edit</th>
                  <th className="px-4 py-3 text-center">Delete</th>
                  <th className="px-4 py-3 text-center rounded-r-xl">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E9]/60 font-body">
                {selectedRole.permissions.map((perm) => (
                  <tr key={perm.moduleKey} className="hover:bg-[#FAF9FB]/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#17151A]">
                      {perm.moduleName}
                    </td>

                    {(['view', 'create', 'edit', 'delete', 'manage'] as PermissionAction[]).map((action) => {
                      const isChecked = perm[action];
                      const disabled = selectedRole.isSystemProtected;

                      return (
                        <td key={action} className="px-4 py-3 text-center align-middle">
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => handleTogglePermission(perm.moduleKey, action)}
                            className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-all ${
                              disabled
                                ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed'
                                : isChecked
                                ? 'bg-[#765087] text-white shadow-subtle hover:bg-[#684577]'
                                : 'bg-[#F3F3F5] text-transparent hover:border-[#9662AD] border border-transparent hover:bg-white'
                            }`}
                            aria-label={`Toggle ${action} for ${perm.moduleName}`}
                          >
                            <Check className={`w-3.5 h-3.5 stroke-[2.5] ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-[#E7E5E9]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#77727D] gap-2">
            <span>
              Changes to this matrix take effect instantly across active tenant user sessions.
            </span>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded bg-[#765087]" />
              <span>Granted Access</span>
              <span className="w-2.5 h-2.5 rounded bg-[#F3F3F5] ml-2" />
              <span>Restricted</span>
            </div>
          </div>
        </div>

      </div>

      {/* Role Create / Edit Modal */}
      <RoleFormModal
        isOpen={isCreateModalOpen || Boolean(roleToEdit)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setRoleToEdit(null);
        }}
        onSave={handleSaveRoleMeta}
        initialData={roleToEdit}
      />
    </PageLayout>
  );
};
