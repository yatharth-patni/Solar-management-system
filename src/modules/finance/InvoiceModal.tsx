import React from 'react';
import { Modal } from '../../components/common/Modal';
import { Invoice } from './financeTypes';
import { Printer, CheckCircle2, AlertCircle } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onMarkPaid?: (invoiceId: string) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onMarkPaid,
}) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending Payment':
      case 'Issued':
        return 'bg-[#F1EAF5] text-[#80538F] border-[#A986B8]/30';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tax Invoice: ${invoice.invoiceNumber}`}
      subtitle={`${invoice.invoiceType} • Billed to ${invoice.customerName}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 print:m-0 print:p-0">
        
        {/* Header / Invoice Metadata Box */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#F7F6F8] p-4 rounded-lg border border-[#E8E5EA] gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-lg text-[#211D24]">SolarOS</span>
              <span className="text-xs text-[#6F6874] font-medium">Enterprise Billing System</span>
            </div>
            <p className="text-xs text-[#6F6874] mt-0.5">Tax ID: US-EIN-9921498 • State License: TX-SOL-7740</p>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(invoice.status)}`}>
              {invoice.status.toUpperCase()}
            </span>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#211D24] bg-white border border-[#E8E5EA] rounded-md hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-[#6F6874]" />
              <span>Print / Download</span>
            </button>
          </div>
        </div>

        {/* Customer & Issue Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold text-[#6F6874] uppercase tracking-wider">Billed To</h4>
            <p className="text-sm font-semibold text-[#211D24]">{invoice.customerName}</p>
            <p className="text-[#6F6874]">{invoice.customerEmail}</p>
            <p className="text-[#6F6874]">{invoice.customerAddress}</p>
            {invoice.projectName && (
              <p className="text-[#80538F] font-medium pt-1">Project: {invoice.projectName}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:text-right">
            <h4 className="text-[11px] font-bold text-[#6F6874] uppercase tracking-wider">Invoice Details</h4>
            <p className="text-[#211D24]"><span className="text-[#6F6874]">Invoice Number:</span> <span className="font-semibold">{invoice.invoiceNumber}</span></p>
            <p className="text-[#211D24]"><span className="text-[#6F6874]">Date of Issue:</span> {invoice.issueDate}</p>
            <p className="text-[#211D24]"><span className="text-[#6F6874]">Due Date:</span> {invoice.dueDate}</p>
            <p className="text-[#211D24]"><span className="text-[#6F6874]">Payment Terms:</span> {invoice.paymentTerms}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-[#E8E5EA] rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F6F8] border-b border-[#E8E5EA] text-[#6F6874] font-semibold">
              <tr>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-center">Tax</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5EA]">
              {invoice.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 text-[#211D24] font-medium">{item.description}</td>
                  <td className="py-2.5 px-3 text-center text-[#6F6874]">{item.quantity}</td>
                  <td className="py-2.5 px-3 text-right text-[#6F6874]">${item.unitPrice.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-center text-[#6F6874]">{item.taxPercent}%</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-[#211D24]">${item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
          <div className="text-xs text-[#6F6874] max-w-sm">
            <h5 className="font-semibold text-[#211D24] mb-1">Notes & Remittance:</h5>
            <p>{invoice.notes || 'Wire routing: Chase NY • Routing: 021000021 • Account: 8820491823'}</p>
            {invoice.balanceDue > 0 ? (
              <div className="mt-2 flex items-center space-x-1.5 text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Outstanding balance of ${invoice.balanceDue.toLocaleString()} due by {invoice.dueDate}.</span>
              </div>
            ) : (
              <div className="mt-2 flex items-center space-x-1.5 text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Invoice fully settled. No balance pending.</span>
              </div>
            )}
          </div>

          <div className="w-full sm:w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-[#6F6874]">
              <span>Subtotal:</span>
              <span className="font-medium text-[#211D24]">${invoice.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-[#6F6874]">
              <span>State & Local Tax (8%):</span>
              <span className="font-medium text-[#211D24]">${invoice.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#211D24] border-t border-[#E8E5EA] pt-1.5">
              <span>Total Amount:</span>
              <span className="text-[#80538F]">${invoice.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-600 font-medium pt-1">
              <span>Amount Paid:</span>
              <span>-${invoice.paidAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-[#211D24] border-t border-[#E8E5EA] pt-1">
              <span>Balance Due:</span>
              <span className={invoice.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                ${invoice.balanceDue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-[#E8E5EA]">
          <div>
            {invoice.status !== 'Paid' && onMarkPaid && (
              <button
                type="button"
                onClick={() => {
                  onMarkPaid(invoice.id);
                  onClose();
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Invoice as Paid</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#6F6874] hover:text-[#211D24] border border-[#E8E5EA] rounded-md hover:bg-[#F7F6F8] transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </Modal>
  );
};
