"use client";
import { useCallback, useState } from "react";

interface UseSpeechRecognitionOptions {
    onResult: (text: string) => void;
    onError?: (msg: string) => void;
}

export function useSpeechRecognition({ onResult, onError }: UseSpeechRecognitionOptions) {
    const [active, setActive] = useState(false);
    const supported = typeof window !== "undefined" &&
        (("webkitSpeechRecognition" in window) || ("SpeechRecognition" in window));

    const start = useCallback(() => {
        if (!supported) {
            onError?.("Speech recognition not supported");
            return;
        }
        try {
            setActive(true);
            const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SR();
            recognition.lang = "en-US";
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            recognition.onresult = (e: any) => {
                const t = e.results[0][0].transcript;
                onResult(t);
                setActive(false);
            };
            recognition.onerror = () => {
                onError?.("Voice input failed");
                setActive(false);
            };
            recognition.onend = () => setActive(false);
            recognition.start();
        } catch {
            onError?.("Unable to start speech recognition");
            setActive(false);
        }
    }, [supported, onResult, onError]);

    return { start, active, supported };
}