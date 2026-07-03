"use client";

import { useState } from "react";
import { signIn as nextAuthSignIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastProvider";
import { AUTH_CALLBACK_URL } from "@/lib/config";
import Link from "next/link";

export default function SignUpPage() {
    const router = useRouter();
    const toast = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const formFields = [
        {
            id: "name",
            name: "name",
            label: "Name",
            type: "text",
            autoComplete: "name",
            placeholder: "Your name",
            value: name,
            onChange: setName,
        },
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
            autoComplete: "new-password",
            placeholder: "Create a strong password",
            value: password,
            onChange: setPassword,
        },
        {
            id: "confirmPassword",
            name: "confirmPassword",
            label: "Confirm password",
            type: "password",
            autoComplete: "new-password",
            placeholder: "Re-enter your password",
            value: confirmPassword,
            onChange: setConfirmPassword,
        },
    ] as const;

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            toast.error("Sign up failed", "Passwords do not match.");
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await nextAuthSignIn("credentials", {
                name,
                email,
                password,
                register: "true",
                redirect: false,
                callbackUrl: AUTH_CALLBACK_URL,
            });

            if (result?.error) {
                const errorMessage = result.error === "CredentialsSignin" ? "Unable to create your account." : result.error;
                setErrorMessage(errorMessage);
                toast.error("Sign up failed", errorMessage);
                return;
            }

            toast.success("Account created", "You are being redirected to your dashboard.");
            router.push(result?.url ?? AUTH_CALLBACK_URL);
        } catch (error) {
            const message =
                typeof error === "object" && error && "response" in error
                    ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message ??
                      "Unable to create your account.")
                    : error instanceof Error
                        ? error.message
                        : "Unable to create your account.";

            setErrorMessage(message);
            toast.error("Sign up failed", message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setErrorMessage(null);
        toast.info("Google sign up", "Continue in the provider window to finish authentication.");
        await nextAuthSignIn("google", { callbackUrl: AUTH_CALLBACK_URL });
    };

    return (
        <main className="min-h-screen bg-(--primary-bg-color) px-6 py-10 text-(--primary-text-color)">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center gap-10 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <section className="max-w-xl space-y-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-(--primary-color)">Astra</p>
                    <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                        Create your account with backend credentials or Google.
                    </h1>
                    <p className="max-w-lg text-base leading-7 text-(--secondary-text-color)">
                        Every signup route is confirmed by the Express backend before NextAuth completes the session.
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

                        <form className="space-y-4" onSubmit={handleSignUp}>
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
                                {isSubmitting ? "Creating account..." : "Create account"}
                            </button>
                        </form>

                        <p className="mt-4 text-sm text-(--secondary-text-color)">
                            Already have an account?{' '}
                            <Link href="/auth/signin" className="font-medium text-(--primary-color) hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}