import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { CustomerLead, LeadStage, RoofType } from './crmTypes';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<CustomerLead>) => void;
  initialLead?: CustomerLead | null;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLead,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [assignedRep, setAssignedRep] = useState('Liam Zhang');
  const [stage, setStage] = useState<LeadStage>('New Lead');
  const [roofType, setRoofType] = useState<RoofType>('RCC Flat Roof');
  const [monthlyBillAmount, setMonthlyBillAmount] = useState(280);
  const [proposedCapacityKw, setProposedCapacityKw] = useState(5.0);
  const [estimatedValue, setEstimatedValue] = useState(12000);
  const [followUpDate, setFollowUpDate] = useState('Tomorrow, 11:00 AM');
  const [followUpNotes, setFollowUpNotes] = useState('');

  useEffect(() => {
    if (initialLead) {
      setCustomerName(initialLead.customerName);
      setEmail(initialLead.email);
      setPhone(initialLead.phone);
      setAddress(initialLead.address);
      setAssignedRep(initialLead.assignedRep);
      setStage(initialLead.stage);
      setRoofType(initialLead.roofType);
      setMonthlyBillAmount(initialLead.monthlyBillAmount);
      setProposedCapacityKw(initialLead.proposedCapacityKw);
      setEstimatedValue(initialLead.estimatedValue);
      setFollowUpDate(initialLead.followUpDate);
      setFollowUpNotes(initialLead.followUpNotes);
    } else {
      setCustomerName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setAssignedRep('Liam Zhang');
      setStage('New Lead');
      setRoofType('RCC Flat Roof');
      setMonthlyBillAmount(280);
      setProposedCapacityKw(5.0);
      setEstimatedValue(12000);
      setFollowUpDate('Tomorrow, 11:00 AM');
      setFollowUpNotes('');
    }
  }, [initialLead, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialLead?.id || `LD-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      email,
      phone,
      address,
      assignedRep,
      stage,
      roofType,
      monthlyBillAmount: Number(monthlyBillAmount),
      avgConsumptionKwh: Math.round(Number(monthlyBillAmount) * 3.75),
      proposedCapacityKw: Number(proposedCapacityKw),
      estimatedValue: Number(estimatedValue),
      followUpDate,
      followUpNotes,
      createdDate: initialLead?.createdDate || 'Nov 21, 2026',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialLead ? 'Edit Lead & Customer Profile' : 'Create Solar Prospect Lead'}
      subtitle="Capture customer roof specifications, energy bill telemetry, and assigned sales executive."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Customer / Company Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. John Henderson"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Assigned Sales Representative *
            </label>
            <select
              value={assignedRep}
              onChange={(e) => setAssignedRep(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            >
              <option value="Liam Zhang">Liam Zhang (Senior Commercial)</option>
              <option value="Priya Sharma">Priya Sharma (Residential Lead)</option>
              <option value="Elena Rostova">Elena Rostova (Enterprise EPC)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@email.com"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211D24] mb-1">
            Site / Rooftop Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 104 Willowbrook Road, Springfield"
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            required
          />
        </div>

        {/* Technical Requirements */}
        <div className="p-3.5 rounded-xl bg-[#FAF9FB] border border-[#E8E5EA] grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Roofing Profile
            </label>
            <select
              value={roofType}
              onChange={(e) => setRoofType(e.target.value as RoofType)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-[#E8E5EA] focus:outline-none focus:border-[#80538F]"
            >
              <option value="RCC Flat Roof">RCC Flat Roof</option>
              <option value="Slanted Tile">Slanted Tile</option>
              <option value="Metal Sheet">Standing Seam Metal</option>
              <option value="Ground Mount">Ground Mount System</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Current Monthly Bill ($)
            </label>
            <input
              type="number"
              value={monthlyBillAmount}
              onChange={(e) => setMonthlyBillAmount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-[#E8E5EA] focus:outline-none focus:border-[#80538F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Target Capacity (kW)
            </label>
            <input
              type="number"
              step="0.1"
              value={proposedCapacityKw}
              onChange={(e) => {
                const kw = Number(e.target.value);
                setProposedCapacityKw(kw);
                setEstimatedValue(Math.round(kw * 2200));
              }}
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-[#E8E5EA] focus:outline-none focus:border-[#80538F]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Pipeline Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as LeadStage)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            >
              <option value="New Lead">1. New Lead</option>
              <option value="Contacted">2. Contacted</option>
              <option value="Site Survey Scheduled">3. Site Survey Scheduled</option>
              <option value="Survey Approved">4. Survey Approved</option>
              <option value="Quotation Sent">5. Quotation Sent</option>
              <option value="Won / Handoff">6. Won / Handoff to Projects</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Next Follow-up Reminder
            </label>
            <input
              type="text"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              placeholder="e.g. Nov 25, 2:00 PM"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211D24] mb-1">
            Follow-up Notes / Customer Discussion
          </label>
          <textarea
            value={followUpNotes}
            onChange={(e) => setFollowUpNotes(e.target.value)}
            rows={2}
            placeholder="Record customer preferences, battery backup interest, or financing questions..."
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
            {initialLead ? 'Update Lead Record' : 'Save Prospect Lead'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
