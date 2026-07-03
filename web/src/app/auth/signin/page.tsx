"use client";

import { useState } from "react";
import { signIn as nextAuthSignIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastProvider";
import { AUTH_CALLBACK_URL } from "@/lib/config";
import Link from "next/link";

export default function SignInPage() {
    const router = useRouter();
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const formFields = [
        {
            id: "email",
            name: "email",
            label: "Email",
            type: "email",
            autoComplete: "email",
            placeholder: "you@example.com",
            value: email,
            onChange: setEmail,
        },
        {
            id: "password",
            name: "password",
            label: "Password",
            type: "password",
            autoComplete: "current-password",
            placeholder: "Enter your password",
            value: password,
            onChange: setPassword,
        },
    ] as const;

    const handleCredentialsSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const result = await nextAuthSignIn("credentials", {
                email,
                password,
                register: "false",
                redirect: false,
                callbackUrl: AUTH_CALLBACK_URL,
            });

            if (result?.error) {
                const errorMessage = result.error === "CredentialsSignin" ? "Unable to sign in with those credentials." : result.error;
                setErrorMessage(errorMessage);
                toast.error("Sign in failed", errorMessage);
                return;
            }

            toast.success("Signed in", "You are being redirected to your dashboard.");

            router.push(result?.url ?? AUTH_CALLBACK_URL);
        } catch (error) {
            const message =
                typeof error === "object" && error && "response" in error
                    ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message ??
                      "Unable to sign in with those credentials.")
                    : error instanceof Error
                        ? error.message
                        : "Unable to sign in with those credentials.";

            setErrorMessage(message);
            toast.error("Sign in failed", message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setErrorMessage(null);
        toast.info("Google sign in", "Continue in the provider window to finish authentication.");
        await nextAuthSignIn("google", { callbackUrl: AUTH_CALLBACK_URL });
    };

    return (
        <main className="min-h-screen bg-(--primary-bg-color) px-6 py-10 text-(--primary-text-color)">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center gap-10 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <section className="max-w-xl space-y-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-(--primary-color)">Astra</p>
                    <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                        Sign in with your account or continue with Google.
                    </h1>
                    <p className="max-w-lg text-base leading-7 text-(--secondary-text-color)">
                        Use your backend credentials for local accounts, or let NextAuth handle Google sign-in.
                    </p>
                </section>

                <section className="rounded-4xl border border-(--border-color) bg-(--surface-color) p-6 backdrop-blur xl:p-8">
                    <div className="space-y-5">
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-(--border-color) bg-(--surface-strong-color) px-4 py-3 text-sm font-medium text-(--primary-text-color) transition hover:bg-(--surface-color)"
                        >
                            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                            Continue with Google
                        </button>

                        <div className="relative flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-(--secondary-text-color)">
                            <span className="h-px flex-1 bg-(--border-color)" />
                            <span>or</span>
                            <span className="h-px flex-1 bg-(--border-color)" />
                        </div>

                        <form className="space-y-4" onSubmit={handleCredentialsSignIn}>
                            {formFields.map((field) => (
                                <div key={field.id} className="space-y-2">
                                    <label htmlFor={field.id} className="mb-2 block text-sm font-medium text-(--primary-text-color)">
                                        {field.label}
                                    </label>
                                    <input
                                        id={field.id}
                                        name={field.name}
                                        type={field.type}
                                        autoComplete={field.autoComplete}
                                        value={field.value}
                                        onChange={(event) => field.onChange(event.target.value)}
                                        className="w-full rounded-2xl border border-(--border-color) bg-(--surface-strong-color) px-4 py-3 text-sm text-(--primary-text-color) outline-none transition-all duration-200 ease-out transform-gpu placeholder:text-(--secondary-text-color) hover:-translate-y-0.5 hover:border-(--primary-color)/50 focus:-translate-y-0.5 focus:border-(--primary-color) focus:shadow-lg focus:shadow-(--primary-color)/10 focus:ring-2 focus:ring-(--primary-color)/20"
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            ))}

                            {errorMessage ? (
                                <p className="rounded-2xl border border-(--primary-color) bg-(--surface-strong-color) px-4 py-3 text-sm text-(--primary-text-color)">
                                    {errorMessage}
                                </p>
                            ) : null}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-2xl bg-(--primary-color) px-4 py-3 text-sm font-semibold text-(--surface-color) transition hover:bg-(--secondary-color) disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </button>
                        </form>

                        <p className="text-sm text-(--secondary-text-color)">
                            New here?{' '}
                            <Link href="/auth/signup" className="font-medium text-(--primary-color) hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}