"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Toast from "@/components/ui/toast";
import type { ToastContextValue, ToastInput, ToastItem } from "@/types/toast";

const ToastContext = createContext<ToastContextValue | null>(null);

const defaultDuration = 4500;

function createToastId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createToast(toast: ToastInput): ToastItem {
    return {
        id: createToastId(),
        title: toast.title,
        description: toast.description,
        variant: toast.variant ?? "info",
        createdAt: Date.now(),
    };
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used within a ToastProvider.");
    }

    return context;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    useEffect(() => {
        const timers = timersRef.current;

        return () => {
            timers.forEach((timer) => clearTimeout(timer));
            timers.clear();
        };
    }, []);

    const dismissToast = useCallback((id: string) => {
        const timer = timersRef.current.get(id);

        if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(id);
        }

        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, []);

    const clearToasts = useCallback(() => {
        timersRef.current.forEach((timer) => clearTimeout(timer));
        timersRef.current.clear();
        setToasts([]);
    }, []);

    const showToast = useCallback((toast: ToastInput) => {
        const item = createToast(toast);
        const duration = toast.duration ?? defaultDuration;

        setToasts((currentToasts) => [...currentToasts, item].slice(-4));

        const timer = setTimeout(() => {
            dismissToast(item.id);
        }, duration);

        timersRef.current.set(item.id, timer);

        return item.id;
    }, [dismissToast]);

    const success = useCallback(
        (title: string, description?: string, duration?: number) =>
            showToast({ title, description, variant: "success", duration }),
        [showToast],
    );

    const error = useCallback(
        (title: string, description?: string, duration?: number) =>
            showToast({ title, description, variant: "error", duration }),
        [showToast],
    );

    const info = useCallback(
        (title: string, description?: string, duration?: number) =>
            showToast({ title, description, variant: "info", duration }),
        [showToast],
    );

    const warning = useCallback(
        (title: string, description?: string, duration?: number) =>
            showToast({ title, description, variant: "warning", duration }),
        [showToast],
    );

    const value = useMemo<ToastContextValue>(
        () => ({
            toasts,
            showToast,
            dismissToast,
            clearToasts,
            success,
            error,
            info,
            warning,
        }),
        [toasts, showToast, dismissToast, clearToasts, success, error, info, warning],
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toast toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    );
}