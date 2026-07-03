import type { ToastItem } from "@/types/toast";

const variantStyles: Record<ToastItem["variant"], { ring: string; title: string; badge: string }> = {
	success: {
		ring: "border-emerald-500/40 bg-emerald-950/80 text-emerald-50 shadow-emerald-950/30",
		title: "text-emerald-50",
		badge: "bg-emerald-400",
	},
	error: {
		ring: "border-rose-500/40 bg-rose-950/80 text-rose-50 shadow-rose-950/30",
		title: "text-rose-50",
		badge: "bg-rose-400",
	},
	info: {
		ring: "border-sky-500/40 bg-sky-950/80 text-sky-50 shadow-sky-950/30",
		title: "text-sky-50",
		badge: "bg-sky-400",
	},
	warning: {
		ring: "border-amber-500/40 bg-amber-950/80 text-amber-50 shadow-amber-950/30",
		title: "text-amber-50",
		badge: "bg-amber-400",
	},
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
							className={`pointer-events-auto rounded-3xl border p-4 shadow-2xl backdrop-blur ${styles.ring} animate-toast-enter`}
						>
							<div className="flex items-start gap-3">
								<span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${styles.badge}`} />
								<div className="min-w-0 flex-1 space-y-1">
									<div className="flex items-start gap-3">
										<h2 className={`text-sm font-semibold ${styles.title}`}>{toast.title}</h2>
										<button
											type="button"
											onClick={() => onDismiss(toast.id)}
											className="ml-auto rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-[0.25em] text-white/70 transition hover:bg-white/10 hover:text-white"
											aria-label="Dismiss toast"
										>
											Close
										</button>
									</div>
									{toast.description ? (
										<p className="text-sm leading-6 text-white/80">{toast.description}</p>
									) : null}
								</div>
							</div>
						</article>
					);
				})}
			</div>
		</div>
	);
}