import { useState, useEffect } from 'react';
import { X, Edit2 } from 'lucide-react';

interface RenameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRename: (newTitle: string) => void;
    initialTitle: string;
    isLoading?: boolean;
}

export default function RenameModal({
    isOpen,
    onClose,
    onRename,
    initialTitle,
    isLoading = false
}: RenameModalProps) {
    const [isRendered, setIsRendered] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);
    const [title, setTitle] = useState(initialTitle);

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle, isOpen]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && title.trim() !== initialTitle) {
            onRename(title.trim());
        } else {
            onClose();
        }
    };

    return (
        <div className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-(--surface-color) border border-(--border-color) rounded-2xl p-6 w-full max-w-md shadow-2xl transition-all duration-300 ease-out transform ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-bold flex items-center text-(--primary-text-color)">
                        <Edit2 className="w-5 h-5 mr-2 text-(--primary-color)" /> Rename Conversation
                    </h2>
                    <button onClick={onClose} disabled={isLoading} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-(--secondary-text-color) mb-2">
                            Conversation Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-4 py-2 border border-(--border-color) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-color) text-sm text-(--primary-text-color) bg-transparent"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 rounded-lg text-sm font-medium border border-(--border-color) text-(--primary-text-color) hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !title.trim()}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-(--primary-color) hover:bg-blue-700 text-white disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}