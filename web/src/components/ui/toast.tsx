import type { ToastItem } from "@/types/toast";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const variantStyles: Record<ToastItem["variant"], { ring: string; iconColor: string }> = {
	success: { ring: "border-emerald-200", iconColor: "text-emerald-500" },
	error: { ring: "border-rose-200", iconColor: "text-rose-500" },
	info: { ring: "border-blue-200", iconColor: "text-blue-500" },
	warning: { ring: "border-amber-200", iconColor: "text-amber-500" },
};

export default function Toast({
	toasts,
	onDismiss,
}: {
	toasts: ToastItem[];
	onDismiss: (id: string) => void;
}) {
	return (
		<div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:inset-x-auto sm:right-6 sm:top-6 sm:bottom-auto sm:justify-end sm:p-0">
			<div className="flex w-full max-w-sm flex-col gap-3" aria-live="polite" aria-relevant="additions removals">
				{toasts.map((toast) => {
					const styles = variantStyles[toast.variant];

					return (
						<article
							key={toast.id}
							className={`pointer-events-auto rounded-2xl border bg-white/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md animate-toast-enter ${styles.ring}`}
						>
							<div className="flex items-start gap-3">
								<div className={`mt-0.5 shrink-0 ${styles.iconColor}`}>
									{toast.variant === 'success' && <CheckCircle2 className="w-5 h-5" />}
									{toast.variant === 'error' && <AlertCircle className="w-5 h-5" />}
									{toast.variant === 'warning' && <AlertTriangle className="w-5 h-5" />}
									{toast.variant === 'info' && <Info className="w-5 h-5" />}
								</div>
								<div className="min-w-0 flex-1 space-y-1 mt-0.5">
									<h2 className={`text-sm font-semibold text-gray-900`}>{toast.title}</h2>
									{toast.description ? (
										<p className="text-sm leading-snug text-gray-500">{toast.description}</p>
									) : null}
								</div>
								<button
									type="button"
									onClick={() => onDismiss(toast.id)}
									className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
									aria-label="Dismiss toast"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						</article>
					);
				})}
			</div>
		</div>
	);
}