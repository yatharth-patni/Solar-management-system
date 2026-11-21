import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { ProjectTask } from './projectTypes';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: ProjectTask) => void;
  projectId?: string;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  projectId = 'PRJ-401',
}) => {
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('Klaus Vogel');
  const [dueDate, setDueDate] = useState('Tomorrow');
  const [priority, setPriority] = useState<ProjectTask['priority']>('High');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTask({
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      projectId,
      title,
      assignedTo,
      dueDate,
      priority,
      status: 'To Do',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Project Execution Task"
      subtitle={`Link work task to Project ${projectId}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#211D24] mb-1">
            Task Title / Action Item *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Schedule net meter electrical inspection with utility"
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Assigned Field Person
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            >
              <option value="Klaus Vogel">Klaus Vogel (Lead HV Tech)</option>
              <option value="Robert Hastings">Robert Hastings (Solar Roofer)</option>
              <option value="Aoi Tanaka">Aoi Tanaka (Commissioning)</option>
              <option value="Elena Rostova">Elena Rostova (Project Manager)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211D24] mb-1">
            Due Date
          </label>
          <input
            type="text"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="e.g. Nov 25, 2026"
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
          />
        </div>

        <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-[#E8E5EA]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#6F6874] hover:text-[#211D24] hover:bg-[#F2F0F4] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#80538F] hover:bg-[#693F77] text-white shadow-subtle transition-all"
          >
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
};
