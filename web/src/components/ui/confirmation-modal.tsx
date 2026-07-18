import { useState, useEffect } from 'react';
import { X, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export type ConfirmationVariant = 'danger' | 'warning' | 'info';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmationVariant;
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    isLoading = false
}: ConfirmationModalProps) {
    const [isRendered, setIsRendered] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setIsRendered(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered) return null;

    const variantStyles = {
        danger: {
            icon: <AlertCircle className="w-6 h-6 text-red-600" />,
            iconBg: "bg-red-100",
            confirmBtn: "bg-red-600 hover:bg-red-700 text-white border-transparent"
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
            iconBg: "bg-orange-100",
            confirmBtn: "bg-orange-600 hover:bg-orange-700 text-white border-transparent"
        },
        info: {
            icon: <Info className="w-6 h-6 text-blue-600" />,
            iconBg: "bg-blue-100",
            confirmBtn: "bg-(--primary-color) hover:bg-blue-700 text-white border-transparent"
        }
    };

    const currentStyle = variantStyles[variant];

    return (
        <div className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-(--surface-color) border border-(--border-color) rounded-2xl p-6 w-full max-w-md shadow-2xl transition-all duration-300 ease-out transform ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentStyle.iconBg}`}>
                        {currentStyle.icon}
                    </div>
                    <button onClick={onClose} disabled={isLoading} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <h3 className="text-xl font-bold text-(--primary-text-color) mb-2">{title}</h3>
                <p className="text-(--secondary-text-color) text-sm mb-6">{description}</p>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg text-sm font-medium border border-(--border-color) text-(--primary-text-color) hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${currentStyle.confirmBtn}`}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}