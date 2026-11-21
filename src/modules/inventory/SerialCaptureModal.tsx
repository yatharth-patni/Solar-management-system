import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { StockDispatch } from './inventoryTypes';

interface SerialCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispatchRecord: StockDispatch | null;
  onSaveSerials: (dispatchId: string, serials: { equipment: string; serialNo: string }[]) => void;
}

export const SerialCaptureModal: React.FC<SerialCaptureModalProps> = ({
  isOpen,
  onClose,
  dispatchRecord,
  onSaveSerials,
}) => {
  if (!dispatchRecord) return null;

  const [serials, setSerials] = useState<{ equipment: string; serialNo: string }[]>(
    dispatchRecord.serialNumbersCaptured.length > 0
      ? dispatchRecord.serialNumbersCaptured
      : [
          { equipment: 'Solar Inverter', serialNo: 'INV-2026-X01' },
          { equipment: 'Panel String #1', serialNo: 'PANEL-SLR-101' },
          { equipment: 'Panel String #2', serialNo: 'PANEL-SLR-102' },
          { equipment: 'Battery Unit (If Applicable)', serialNo: 'BAT-LFP-901' },
        ]
  );

  const handleUpdate = (idx: number, serialNo: string) => {
    setSerials(prev => prev.map((item, i) => i === idx ? { ...item, serialNo } : item));
  };

  const handleAddEquipment = () => {
    setSerials(prev => [...prev, { equipment: 'Additional Serialized Unit', serialNo: '' }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSerials(dispatchRecord.id, serials);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Capture & Link Hardware Serial Numbers"
      subtitle={`Customer: ${dispatchRecord.customerName} • Project ID: ${dispatchRecord.projectId}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 rounded-xl bg-[#FAF9FB] border border-[#E8E5EA] text-xs text-[#6F6874] space-y-1">
          <p className="font-semibold text-[#211D24]">Compliance Rule:</p>
          <p>Serial numbers of installed panels and inverters are linked directly to this customer record for lifetime OEM warranty and RMA processing.</p>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {serials.map((s, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-[#E8E5EA] bg-white flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-[#211D24] w-1/3 truncate">
                {s.equipment}
              </span>
              <input
                type="text"
                value={s.serialNo}
                onChange={(e) => handleUpdate(idx, e.target.value)}
                placeholder="Scan or enter serial no..."
                className="w-2/3 px-3 py-1.5 rounded-lg text-xs bg-[#F7F6F8] border border-[#E8E5EA] font-mono focus:bg-white focus:border-[#80538F]"
                required
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddEquipment}
          className="text-xs text-[#80538F] font-semibold hover:underline"
        >
          + Add another serialized equipment component
        </button>

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
            Commit Serials to Customer File
          </button>
        </div>
      </form>
    </Modal>
  );
};
