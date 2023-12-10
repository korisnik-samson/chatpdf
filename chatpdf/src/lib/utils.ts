import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function convertToASCII(inputString: string) {
    // remove non ascii characters
    return inputString.replace(/[^\x00-\x7F]/g, "");
}

export function dateGenerate(): string {
    const date = Date.now().toString();
    return date.substring(0, date.length - 2)
}