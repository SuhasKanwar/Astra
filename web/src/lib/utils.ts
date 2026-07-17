import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import MarkdownIt from 'markdown-it';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
});