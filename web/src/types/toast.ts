export type ToastVariant = "success" | "error" | "info" | "warning";

export type ToastInput = {
	title: string;
	description?: string;
	variant?: ToastVariant;
	duration?: number;
};

export type ToastItem = {
	id: string;
	title: string;
	description?: string;
	variant: ToastVariant;
	createdAt: number;
};

export type ToastContextValue = {
	toasts: ToastItem[];
	showToast: (toast: ToastInput) => string;
	dismissToast: (id: string) => void;
	clearToasts: () => void;
	success: (title: string, description?: string, duration?: number) => string;
	error: (title: string, description?: string, duration?: number) => string;
	info: (title: string, description?: string, duration?: number) => string;
	warning: (title: string, description?: string, duration?: number) => string;
};