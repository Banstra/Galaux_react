'use client';

import { X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}


export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  variant = 'danger',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass w-full max-w-md rounded-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`shrink-0 rounded-xl p-3 ${isDanger ? 'bg-coral/10 text-coral' : 'bg-warning/10 text-warning'}`}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="font-display text-xl text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="ml-auto text-slate-500 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="btn-ghost !px-5 !py-2.5">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`!px-5 !py-2.5 ${isDanger ? 'bg-coral hover:bg-coral/90 text-white' : 'bg-warning hover:bg-warning/90 text-black'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
