import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { ServiceTicket } from './warrantyTypes';

interface TicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTicket: (ticket: ServiceTicket) => void;
}

export const TicketFormModal: React.FC<TicketFormModalProps> = ({
  isOpen,
  onClose,
  onSaveTicket,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [equipmentName, setEquipmentName] = useState('Inverter');
  const [issueDescription, setIssueDescription] = useState('');
  const [priority, setPriority] = useState<ServiceTicket['priority']>('High');
  const [assignedTechnician, setAssignedTechnician] = useState('Klaus Vogel');
  const [isCovered, setIsCovered] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTicket({
      id: `TKT-${Math.floor(300 + Math.random() * 700)}`,
      customerName,
      serialNumber: serialNumber.toUpperCase(),
      equipmentName,
      issueDescription,
      priority,
      assignedTechnician,
      createdDate: 'Nov 21, 2026',
      status: 'Open',
      isCoveredUnderWarranty: isCovered,
      customerConfirmedResolution: false,
      handedOffToFinance: !isCovered,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Service / RMA Support Ticket"
      subtitle="Dispatch solar repair technician and verify equipment warranty coverage."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#211D24] mb-1">
            Customer Name *
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Robert Vance Residence"
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Equipment Serial Number *
            </label>
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="e.g. INV-2026-X8891"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] font-mono focus:bg-white focus:border-[#80538F]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Component Type
            </label>
            <input
              type="text"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              placeholder="e.g. Hybrid Inverter 5kW"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211D24] mb-1">
            Issue Symptom / Inverter Fault Code *
          </label>
          <textarea
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            rows={3}
            placeholder="Describe inverter error codes, output voltage drops, or physical defects..."
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Dispatch Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            >
              <option value="Urgent">Urgent (Zero Output / Safety)</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Assigned Field Technician
            </label>
            <select
              value={assignedTechnician}
              onChange={(e) => setAssignedTechnician(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            >
              <option value="Klaus Vogel">Klaus Vogel (Lead HV Tech)</option>
              <option value="Robert Hastings">Robert Hastings (Solar Roofer)</option>
              <option value="Soren Lind">Soren Lind (Commissioning)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="isCoveredCheck"
            checked={isCovered}
            onChange={(e) => setIsCovered(e.target.checked)}
            className="w-4 h-4 rounded text-[#80538F] focus:ring-[#80538F]"
          />
          <label htmlFor="isCoveredCheck" className="text-xs text-[#211D24] font-medium cursor-pointer">
            Covered under active OEM warranty (Free RMA Service)
          </label>
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
            Dispatch Ticket
          </button>
        </div>
      </form>
    </Modal>
  );
};
