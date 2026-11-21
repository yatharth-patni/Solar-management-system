import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { CustomerPayment, PaymentType, PaymentMethod, PaymentStatus } from './financeTypes';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (payment: CustomerPayment) => void;
  initialPayment?: CustomerPayment | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSavePayment,
  initialPayment,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [paymentType, setPaymentType] = useState<PaymentType>('Advance');
  const [amount, setAmount] = useState<number>(5000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Wire');
  const [status, setStatus] = useState<PaymentStatus>('Cleared');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialPayment) {
      setCustomerName(initialPayment.customerName);
      setProjectName(initialPayment.projectName);
      setPaymentType(initialPayment.paymentType);
      setAmount(initialPayment.amount);
      setPaymentMethod(initialPayment.paymentMethod);
      setStatus(initialPayment.status);
      setPaymentDate(initialPayment.paymentDate);
      setReferenceNo(initialPayment.referenceNo);
      setNotes(initialPayment.notes || '');
    } else {
      setCustomerName('');
      setProjectName('');
      setPaymentType('Advance');
      setAmount(5000);
      setPaymentMethod('Bank Wire');
      setStatus('Cleared');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setReferenceNo(`TXN-${Math.floor(100000 + Math.random() * 900000)}`);
      setNotes('');
    }
  }, [initialPayment, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payment: CustomerPayment = {
      id: initialPayment ? initialPayment.id : `PAY-${Math.floor(800 + Math.random() * 200)}`,
      paymentNumber: initialPayment ? initialPayment.paymentNumber : `PMT-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: initialPayment ? initialPayment.customerId : 'CUST-NEW',
      customerName,
      projectId: initialPayment ? initialPayment.projectId : 'PRJ-NEW',
      projectName: projectName || 'Residential PV Package',
      paymentType,
      amount: Number(amount),
      paymentMethod,
      status,
      paymentDate,
      referenceNo: referenceNo || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      notes,
    };
    onSavePayment(payment);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialPayment ? `Edit Payment: ${initialPayment.paymentNumber}` : 'Record Customer Payment'}
      subtitle="Register advance deposit, milestone progress installment, or final project settlement."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Robert Vance"
              className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Project Reference *
            </label>
            <input
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Vance Residence 5kW Hybrid"
              className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Payment Stage *
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as PaymentType)}
              className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F] bg-white"
            >
              <option value="Advance">Advance (Commencement)</option>
              <option value="Milestone">Milestone (Hardware/Erection)</option>
              <option value="Final">Final Settlement (Grid Handover)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Amount ($ USD) *
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Payment Method *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F] bg-white"
            >
              <option value="Bank Wire">Bank Wire Transfer</option>
              <option value="Digital Gateway">Digital Gateway / ACH</option>
              <option value="Cheque">Physical Cheque</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Direct Debit">Direct Debit</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PaymentStatus)}
              className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F] bg-white"
            >
              <option value="Cleared">Cleared (Funds in Bank)</option>
              <option value="Pending Verification">Pending Bank Reconciliation</option>
              <option value="Overdue">Overdue</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Payment Date *
            </label>
            <input
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Bank Ref / Cheque # *
            </label>
            <input
              type="text"
              required
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              placeholder="e.g. WIRE-TXN-9981"
              className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211D24] mb-1">
            Internal Accounting Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Verified with Chase commercial checking account..."
            className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F]"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-[#E8E5EA]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#6F6874] hover:text-[#211D24] border border-[#E8E5EA] rounded-md hover:bg-[#F7F6F8] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium text-white bg-[#80538F] hover:bg-[#6F477D] rounded-md transition-colors"
          >
            {initialPayment ? 'Update Payment' : 'Record Payment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
