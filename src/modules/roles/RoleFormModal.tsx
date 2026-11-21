import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { SystemRole } from './roleTypes';
import { MODULE_KEYS } from './roleData';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Partial<SystemRole>) => void;
  initialData?: SystemRole | null;
}

export const RoleFormModal: React.FC<RoleFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Platform' | 'Tenant Admin' | 'Field Operations' | 'Back Office'>('Field Operations');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setCategory(initialData.category);
    } else {
      setName('');
      setDescription('');
      setCategory('Field Operations');
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Role name is required.');
      return;
    }

    onSave({
      id: initialData?.id || `role-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: name.trim(),
      description: description.trim() || 'Custom defined role with tailored module access capabilities.',
      category,
      userCount: initialData?.userCount || 0,
      isSystemProtected: false,
      permissions: initialData?.permissions || MODULE_KEYS.map(m => ({
        moduleKey: m.key,
        moduleName: m.name,
        view: true,
        create: false,
        edit: false,
        delete: false,
        manage: false,
      })),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Role Metadata' : 'Create Custom Platform Role'}
      subtitle="Define role name and architectural tier before mapping permissions matrix."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#17151A] mb-1">
            Role Title *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Senior Commissioning Engineer"
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#17151A] mb-1">
            Functional Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
          >
            <option value="Tenant Admin">Tenant Admin</option>
            <option value="Field Operations">Field Operations</option>
            <option value="Back Office">Back Office</option>
            <option value="Platform">Platform Infrastructure</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#17151A] mb-1">
            Role Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe the operational responsibilities and system expectations for this role..."
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
          />
        </div>

        <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-[#E7E5E9]/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#765087] hover:bg-[#684577] text-white shadow-subtle transition-all"
          >
            {initialData ? 'Update Role' : 'Create Role'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
