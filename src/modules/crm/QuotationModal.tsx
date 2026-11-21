import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Quotation, CustomerLead } from './crmTypes';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: CustomerLead | null;
  onSaveQuotation: (quotation: Quotation) => void;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSaveQuotation,
}) => {
  if (!lead) return null;

  const [capacityKw, setCapacityKw] = useState(lead.proposedCapacityKw || 5.0);
  const [panelModel, setPanelModel] = useState('Tier-1 Monocrystalline 540W');
  const [inverterModel, setInverterModel] = useState('Hybrid Grid-Tied Inverter 5kW');
  const [batteryBackup, setBatteryBackup] = useState('10 kWh Lithium Battery Bank');
  const [proposedPrice, setProposedPrice] = useState(lead.estimatedValue || 13500);
  const [validUntil] = useState('Dec 31, 2026');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuotation: Quotation = {
      id: `QT-${Math.floor(200 + Math.random() * 800)}`,
      leadId: lead.id,
      customerName: lead.customerName,
      capacityKw: Number(capacityKw),
      panelModel,
      inverterModel,
      batteryBackup,
      proposedPrice: Number(proposedPrice),
      estAnnualGenerationKwh: Math.round(Number(capacityKw) * 1500),
      validUntil,
      status: 'Sent',
      handoffStatus: 'Pending',
    };
    onSaveQuotation(newQuotation);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Formal Solar Proposal & Quotation"
      subtitle={`Customer: ${lead.customerName} • Roof: ${lead.roofType}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              System Capacity (kW)
            </label>
            <input
              type="number"
              step="0.1"
              value={capacityKw}
              onChange={(e) => {
                const kw = Number(e.target.value);
                setCapacityKw(kw);
                setProposedPrice(Math.round(kw * 2300));
              }}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Proposed Price ($)
            </label>
            <input
              type="number"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211D24] mb-1">
            Solar PV Module Specification
          </label>
          <select
            value={panelModel}
            onChange={(e) => setPanelModel(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
          >
            <option value="Tier-1 Monocrystalline 540W">Tier-1 Monocrystalline 540W (Top Con High Efficiency)</option>
            <option value="Bifacial Glass-Glass 580W">Bifacial Dual-Glass 580W (Max Energy Yield)</option>
            <option value="All-Black Architectural 400W">All-Black Architectural 400W (Aesthetic Residential)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Inverter Architecture
            </label>
            <select
              value={inverterModel}
              onChange={(e) => setInverterModel(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            >
              <option value="Hybrid Grid-Tied Inverter 5kW">Hybrid Inverter 5kW (Battery Storage Ready)</option>
              <option value="Standard String Inverter 6kW">Standard String Inverter 6kW (Grid Export)</option>
              <option value="Enphase IQ8 Microinverter Cluster">Enphase IQ8 Microinverter Cluster (Per-Panel MPPT)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Storage Battery Configuration
            </label>
            <select
              value={batteryBackup}
              onChange={(e) => setBatteryBackup(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            >
              <option value="10 kWh Lithium Battery Bank">10 kWh LiFePO4 Battery Bank (Full Night Backup)</option>
              <option value="5 kWh Lithium Battery Bank">5 kWh LiFePO4 Modular Unit (Essential Loads)</option>
              <option value="Grid-Tied without Battery">Grid-Tied without Battery (Direct Net Metering)</option>
            </select>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF9FB] border border-[#E8E5EA] flex justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#6F6874] block">Estimated Generation</span>
            <span className="font-semibold text-[#211D24]">{Math.round(capacityKw * 1500).toLocaleString()} kWh / year</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#6F6874] block">Proposal Validity</span>
            <span className="font-semibold text-[#80538F]">{validUntil}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#6F6874] block">Estimated Payback</span>
            <span className="font-semibold text-emerald-700">3.8 Years</span>
          </div>
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
            Issue Formal Proposal
          </button>
        </div>
      </form>
    </Modal>
  );
};
