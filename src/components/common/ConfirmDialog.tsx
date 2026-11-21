import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  confirmLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  confirmLoading = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-[#F0E6F5] flex items-center justify-center text-[#765087] flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
    }
  };

  const confirmBtnClass = {
    danger: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-subtle',
    warning: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-subtle',
    info: 'bg-[#765087] hover:bg-[#684577] active:bg-[#523360] text-white shadow-subtle',
  }[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4">
        <div className="flex items-start space-x-3.5">
          {getIcon()}
          <div className="flex-1 text-xs text-[#77727D] leading-relaxed pt-1">
            {description}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-[#E7E5E9]/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5] transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={confirmLoading}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${confirmBtnClass} disabled:opacity-50`}
          >
            {confirmLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
