import React from 'react';
import { Modal } from '../../components/common/Modal';
import { SolarProject } from './projectTypes';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MapPin, Check } from 'lucide-react';

interface ProjectDetailsModalProps {
  project: SolarProject | null;
  onClose: () => void;
  onToggleMilestone: (projectId: string, milestoneName: string) => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  onClose,
  onToggleMilestone,
}) => {
  if (!project) return null;

  return (
    <Modal
      isOpen={Boolean(project)}
      onClose={onClose}
      title={`Project Workspace: ${project.id}`}
      subtitle={`${project.customerName} • ${project.systemCapacityKw} kW DC Array`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="p-4 rounded-xl bg-[#FAF9FB] border border-[#E8E5EA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display font-bold text-base text-[#211D24]">
                {project.customerName}
              </h3>
              <StatusBadge status={project.status === 'Project Completed' ? 'Success' : 'Pro'} customLabel={project.status} size="sm" />
            </div>
            <p className="text-xs text-[#6F6874] mt-0.5 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#80538F]" />
              <span>{project.siteAddress}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#6F6874] block">Confirmed Quotation</span>
            <span className="font-mono text-xs font-semibold text-[#80538F]">{project.confirmedQuotationId}</span>
          </div>
        </div>

        {/* Team & Timeline */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-[#E8E5EA] bg-white space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#6F6874] block">Project Execution Team</span>
            <p className="font-semibold text-[#211D24]">PM: {project.projectManager}</p>
            <p className="text-[11px] text-[#6F6874]">
              Techs: {project.assignedTechnicians.join(', ')}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-[#E8E5EA] bg-white space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#6F6874] block">Timeline Schedule</span>
            <p className="text-[#211D24]">Start: <strong>{project.startDate}</strong></p>
            <p className="text-[#211D24]">Target Handover: <strong>{project.expectedCompletion}</strong></p>
          </div>
        </div>

        {/* Milestone Progression Tracker */}
        <div className="p-4 rounded-xl border border-[#E8E5EA] bg-white space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#211D24] uppercase tracking-wider font-display">
              Project Execution Milestones ({project.milestones.filter(m => m.completed).length}/7 Completed)
            </p>
            <span className="text-[10px] text-[#6F6874]">Click milestone to update progress</span>
          </div>

          <div className="space-y-2 pt-1">
            {project.milestones.map((milestone, idx) => (
              <div
                key={milestone.name}
                onClick={() => onToggleMilestone(project.id, milestone.name)}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  milestone.completed
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-semibold'
                    : 'bg-[#FAF9FB] border-[#E8E5EA] text-[#6F6874] hover:bg-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    milestone.completed ? 'bg-emerald-600 text-white' : 'bg-[#E8E5EA] text-[#6F6874]'
                  }`}>
                    {idx + 1}
                  </span>
                  <span>{milestone.name}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {milestone.completed && milestone.dateCompleted && (
                    <span className="text-[10px] text-emerald-700 font-normal">{milestone.dateCompleted}</span>
                  )}
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    milestone.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#E8E5EA] bg-white'
                  }`}>
                    {milestone.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-[#E8E5EA]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#80538F] hover:bg-[#693F77] text-white shadow-subtle transition-all"
          >
            Close Workspace
          </button>
        </div>
      </div>
    </Modal>
  );
};
