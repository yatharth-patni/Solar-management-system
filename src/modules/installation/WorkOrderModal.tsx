import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { InstallationWorkOrder, InstallationChecklist } from './installationTypes';

interface WorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: InstallationWorkOrder | null;
  onSaveWorkOrder: (updated: InstallationWorkOrder) => void;
}

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({
  isOpen,
  onClose,
  workOrder,
  onSaveWorkOrder,
}) => {
  if (!workOrder) return null;

  const [startTime, setStartTime] = useState(workOrder.startTime || '08:30 AM');
  const [endTime, setEndTime] = useState(workOrder.endTime || '04:00 PM');
  const [testedVoc, setTestedVoc] = useState(workOrder.testedVocVoltage || 380);
  const [earthResistance, setEarthResistance] = useState(workOrder.earthResistanceOhms || 2.2);
  const [powerGen, setPowerGen] = useState(workOrder.powerGenerationKw || 5.5);
  const [notes, setNotes] = useState(workOrder.technicianNotes || '');
  const [checklist, setChecklist] = useState<InstallationChecklist>(workOrder.checklist);
  const [signatureCaptured, setSignatureCaptured] = useState(workOrder.customerSignatureCaptured);

  useEffect(() => {
    if (workOrder) {
      setStartTime(workOrder.startTime || '08:30 AM');
      setEndTime(workOrder.endTime || '04:00 PM');
      setTestedVoc(workOrder.testedVocVoltage || 380);
      setEarthResistance(workOrder.earthResistanceOhms || 2.2);
      setPowerGen(workOrder.powerGenerationKw || 5.5);
      setNotes(workOrder.technicianNotes || '');
      setChecklist(workOrder.checklist);
      setSignatureCaptured(workOrder.customerSignatureCaptured);
    }
  }, [workOrder]);

  const toggleChecklistItem = (key: keyof InstallationChecklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSimulateSignature = () => {
    setSignatureCaptured(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveWorkOrder({
      ...workOrder,
      startTime,
      endTime,
      testedVocVoltage: Number(testedVoc),
      earthResistanceOhms: Number(earthResistance),
      powerGenerationKw: Number(powerGen),
      technicianNotes: notes,
      checklist,
      customerSignatureCaptured: signatureCaptured,
      status: signatureCaptured && Object.values(checklist).every(Boolean) ? 'Submitted Review' : 'In Progress',
    });
    onClose();
  };

  const checklistItems: { key: keyof InstallationChecklist; label: string }[] = [
    { key: 'dcIsolatorGrounded', label: 'DC Isolator properly grounded & labeled' },
    { key: 'mountingTorqueChecked', label: 'Mounting structure rail torque checked (14-16 Nm)' },
    { key: 'stringVocTested', label: 'PV string open circuit voltage (VOC) verified' },
    { key: 'inverterGridSyncPassed', label: 'Inverter grid synchronisation & anti-islanding test passed' },
    { key: 'acDisconnectLabeled', label: 'AC main utility disconnect switch clearly placarded' },
    { key: 'conduitSealingVerified', label: 'Weatherproof roof penetration conduit sealing verified' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Field Installation Form: ${workOrder.id}`}
      subtitle={`${workOrder.customerName} • ${workOrder.systemCapacityKw} kW System • Techs: ${workOrder.assignedTechnicians.join(', ')}`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Work Window & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Field Work Start Time
            </label>
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Field Work End Time
            </label>
            <input
              type="text"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            />
          </div>
        </div>

        {/* Electrical Commissioning Telemetry Inputs */}
        <div className="p-4 rounded-xl bg-[#FAF9FB] border border-[#E8E5EA] space-y-3">
          <p className="text-xs font-bold text-[#211D24] uppercase tracking-wider font-display">
            Field Electrical Commissioning Telemetry
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#6F6874] mb-1">
                String VOC (Volts)
              </label>
              <input
                type="number"
                value={testedVoc}
                onChange={(e) => setTestedVoc(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-white border border-[#E8E5EA] focus:outline-none focus:border-[#80538F]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6F6874] mb-1">
                Earth Resistance (Ω &lt; 5.0)
              </label>
              <input
                type="number"
                step="0.1"
                value={earthResistance}
                onChange={(e) => setEarthResistance(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-white border border-[#E8E5EA] focus:outline-none focus:border-[#80538F]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6F6874] mb-1">
                Active Generation (kW)
              </label>
              <input
                type="number"
                step="0.1"
                value={powerGen}
                onChange={(e) => setPowerGen(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-white border border-[#E8E5EA] focus:outline-none focus:border-[#80538F]"
              />
            </div>
          </div>
        </div>

        {/* Quality & Safety Checklists */}
        <div>
          <p className="text-xs font-bold text-[#211D24] uppercase tracking-wider mb-2 font-display">
            Onsite QA / Safety Inspection Checklist
          </p>
          <div className="space-y-1.5 border border-[#E8E5EA] rounded-xl p-3 bg-white">
            {checklistItems.map((item) => {
              const isChecked = checklist[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => toggleChecklistItem(item.key)}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    isChecked ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-medium' : 'bg-[#FAF9FB] border-[#E8E5EA] text-[#6F6874]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isChecked ? 'bg-emerald-600 text-white' : 'bg-[#E8E5EA] text-[#6F6874]'
                  }`}>
                    {isChecked ? 'PASS' : 'PENDING'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Digital Sign-off Simulation */}
        <div className="p-3.5 rounded-xl border border-[#E8E5EA] bg-[#FAF9FB] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#211D24] uppercase font-display">
              Homeowner Digital Sign-off
            </span>
            {signatureCaptured ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Signature Verified ✓
              </span>
            ) : (
              <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Required for Handover
              </span>
            )}
          </div>

          <div className="h-16 rounded-xl border border-dashed border-[#E8E5EA] bg-white flex items-center justify-center text-xs text-[#6F6874]">
            {signatureCaptured ? (
              <span className="font-script text-2xl text-[#80538F]">
                {workOrder.customerName}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSimulateSignature}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#F1EAF5] text-[#80538F] hover:bg-[#80538F] hover:text-white transition-colors"
              >
                Capture Customer Signature (Touch / Stylus)
              </button>
            )}
          </div>
        </div>

        {/* Field Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#211D24] mb-1">
            Technician Commissioning Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
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
            Submit Field Record
          </button>
        </div>
      </form>
    </Modal>
  );
};
