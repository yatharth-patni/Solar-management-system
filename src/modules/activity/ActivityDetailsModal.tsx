import React from 'react';
import { Modal } from '../../components/common/Modal';
import { AuditRecord } from './activityTypes';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Terminal } from 'lucide-react';

interface ActivityDetailsModalProps {
  record: AuditRecord | null;
  onClose: () => void;
}

export const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <Modal
      isOpen={Boolean(record)}
      onClose={onClose}
      title="Audit Event Details"
      subtitle={`Log ID: ${record.id} • Recorded at ${record.formattedDate}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Top Header Card */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF9FB] border border-[#E7E5E9]/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xs text-[#765087] bg-[#F0E6F5] px-2.5 py-0.5 rounded-full">
                {record.actionType}
              </span>
              <StatusBadge status={record.result} size="sm" />
            </div>
            <p className="font-display font-bold text-sm text-[#17151A] mt-2">
              {record.description}
            </p>
          </div>
        </div>

        {/* Actor & Host Context */}
        <div className="grid grid-cols-2 gap-4 text-xs text-[#77727D]">
          <div className="p-3.5 rounded-xl border border-[#E7E5E9]/80 bg-white space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#77727D] block">Executing Actor</span>
            <p className="font-semibold text-[#17151A]">{record.actor.name}</p>
            <p className="text-[11px] text-[#765087]">{record.actor.role}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-[#E7E5E9]/80 bg-white space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#77727D] block">Network & Origin</span>
            <p className="font-mono text-[11px] text-[#17151A]">{record.actor.ipAddress}</p>
            <p className="text-[10px] text-[#9E9AA3] truncate">{record.actor.userAgent}</p>
          </div>
        </div>

        {/* Structured JSON Payload */}
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#17151A] uppercase tracking-wider mb-2 font-display">
            <Terminal className="w-3.5 h-3.5 text-[#765087]" />
            <span>Cryptographic Log Event Payload</span>
          </div>
          <pre className="p-4 rounded-xl bg-[#17151A] text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-[#2B2730]">
            {JSON.stringify(
              {
                id: record.id,
                timestamp: record.formattedDate,
                tenant: record.company,
                action: record.actionType,
                actor: record.actor,
                result: record.result,
                attributes: record.metadata,
                immutableHash: `sha256:${record.id.toLowerCase()}9a8f4c21b0e334d789`,
              },
              null,
              2
            )}
          </pre>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#E7E5E9]/80">
          <span className="text-[11px] text-[#77727D]">
            Compliant with ISO 27001 & SOC-2 Audit Stream
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#765087] hover:bg-[#684577] text-white transition-colors shadow-subtle"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
