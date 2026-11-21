import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { CompanyExpense, ExpenseCategory, ExpenseStatus } from './financeTypes';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: CompanyExpense) => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSaveExpense,
}) => {
  const [vendorName, setVendorName] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Hardware Procurement');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(1200);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<ExpenseStatus>('Approved');
  const [linkedProjectId, setLinkedProjectId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: CompanyExpense = {
      id: `EXP-${Math.floor(900 + Math.random() * 100)}`,
      expenseNumber: `EXP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      vendorName,
      description,
      amount: Number(amount),
      expenseDate,
      dueDate: dueDate || expenseDate,
      paymentStatus,
      approvedBy: paymentStatus === 'Approved' || paymentStatus === 'Paid' ? 'Elena Rostova (Super Admin)' : undefined,
      linkedProjectId: linkedProjectId || undefined,
      receiptAttachment: `RECEIPT-${Math.floor(10000 + Math.random() * 90000)}.pdf`,
    };
    onSaveExpense(newExpense);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Company Expenditure"
      subtitle="Log procurement cost, freight haulage, subcontractor invoice, or testing equipment."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Vendor / Supplier Name *
            </label>
            <input
              type="text"
              required
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="e.g. Longi Solar Direct"
              className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Expense Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F] bg-white"
            >
              <option value="Hardware Procurement">Hardware Procurement (PV/Inverters/Batteries)</option>
              <option value="Logistics & Haulage">Logistics & Heavy Transport</option>
              <option value="Civil Subcontractor">Civil Subcontractor & Rigging</option>
              <option value="Permits & Grid Interconnection">Permits & Utility Interconnection</option>
              <option value="Tools & Safety Equipment">Tools & Safety Equipment</option>
              <option value="Operational Overhead">Operational Overhead</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211D24] mb-1">
            Item Description / Purchase Scope *
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Pallet of 30x Longi 540W modules for Vance residence"
            className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Total Amount ($ USD) *
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
              Expense Date *
            </label>
            <input
              type="date"
              required
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Approval Status *
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as ExpenseStatus)}
              className="w-full px-3 py-2 text-xs border border-[#E8E5EA] rounded-md focus:outline-none focus:border-[#80538F] bg-white"
            >
              <option value="Paid">Paid</option>
              <option value="Approved">Approved (Awaiting Payment)</option>
              <option value="Pending Approval">Pending Finance Approval</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211D24] mb-1">
            Linked Project ID (Optional)
          </label>
          <input
            type="text"
            value={linkedProjectId}
            onChange={(e) => setLinkedProjectId(e.target.value)}
            placeholder="e.g. PRJ-401 (Vance Residence)"
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
            Save Expense Record
          </button>
        </div>
      </form>
    </Modal>
  );
};
