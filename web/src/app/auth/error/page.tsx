import Link from "next/link";

export default function AuthErrorPage() {
    return (
        <main className="min-h-screen bg-(--primary-bg-color) px-6 py-10 text-(--primary-text-color) flex flex-col items-center justify-center">
            <div className="mx-auto flex min-h-fit max-w-2xl flex-col justify-center gap-6 rounded-4xl border border-(--border-color) bg-(--surface-color) p-8 shadow-2xl shadow-black/30 backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-(--primary-color)">Authentication error</p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">We could not complete the sign-in flow.</h1>
                <p className="text-base leading-7 text-(--secondary-text-color)">
                    Check your provider settings, then try again. If you were signing in with credentials, verify your email and password.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Link href="/auth/signin" className="rounded-2xl bg-(--primary-color) px-4 py-3 text-sm font-semibold text-(--surface-color) transition hover:bg-(--secondary-color)">
                        Back to sign in
                    </Link>
                    <Link href="/auth/signup" className="rounded-2xl border border-(--border-color) bg-(--surface-color) px-4 py-3 text-sm font-semibold text-(--primary-text-color) transition hover:bg-(--surface-strong-color)">
                        Create account
                    </Link>
                </div>
            </div>
        </main>
    );
}