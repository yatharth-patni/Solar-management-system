import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { InstallationWorkOrder } from './installationTypes';
import { Camera, Image } from 'lucide-react';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: InstallationWorkOrder | null;
  onAddPhoto: (workOrderId: string, photoTitle: string) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  workOrder,
  onAddPhoto,
}) => {
  if (!workOrder) return null;

  const [newPhotoTag, setNewPhotoTag] = useState('');

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTag.trim()) return;
    onAddPhoto(workOrder.id, newPhotoTag.trim());
    setNewPhotoTag('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Field Installation Evidence Vault"
      subtitle={`Work Order: ${workOrder.id} • ${workOrder.customerName}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        <div className="p-3.5 rounded-xl bg-[#FAF9FB] border border-[#E8E5EA] text-xs text-[#6F6874] space-y-1">
          <p className="font-semibold text-[#211D24]">Quality Compliance Requirement:</p>
          <p>High-resolution timestamped photographs of array mounting, DC cabling, inverter screen, and earthing pit are mandated for commissioning sign-off.</p>
        </div>

        {/* Uploaded Photos Grid */}
        <div>
          <p className="text-xs font-bold text-[#211D24] uppercase tracking-wider mb-2 font-display">
            Submitted Photographic Verification ({workOrder.photosUploaded.length})
          </p>

          {workOrder.photosUploaded.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#6F6874] border border-dashed border-[#E8E5EA] rounded-xl bg-[#FAF9FB]">
              <Camera className="w-8 h-8 text-[#A986B8] mx-auto mb-2" />
              <span>No evidence photos uploaded yet for this site.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {workOrder.photosUploaded.map((photo, i) => (
                <div key={i} className="p-3 rounded-xl border border-[#E8E5EA] bg-white space-y-2 shadow-subtle">
                  <div className="h-28 rounded-lg bg-[#F1EAF5] flex items-center justify-center text-[#80538F]">
                    <Image className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[#211D24] truncate">{photo}</p>
                    <span className="text-[10px] text-emerald-700 font-medium">Verified GPS & Timestamp</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Simulation */}
        <form onSubmit={handleSimulateUpload} className="flex gap-2 pt-2 border-t border-[#E8E5EA]">
          <input
            type="text"
            value={newPhotoTag}
            onChange={(e) => setNewPhotoTag(e.target.value)}
            placeholder="e.g. Net Meter Reading Close-up"
            className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#80538F] hover:bg-[#693F77] text-white shadow-subtle transition-all whitespace-nowrap"
          >
            Upload Photo
          </button>
        </form>

        <div className="flex items-center justify-end pt-4 border-t border-[#E8E5EA]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#80538F] hover:bg-[#693F77] text-white shadow-subtle transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
