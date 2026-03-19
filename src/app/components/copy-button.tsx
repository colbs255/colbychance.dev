"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export default function CopyButton() {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            const pre = e.currentTarget.closest("pre");
            if (!pre) return;

            const code = pre.querySelector("code");
            const text = code?.textContent ?? pre.textContent ?? "";

            if (!navigator.clipboard) {
                return;
            }

            navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => setCopied(false), 2000);
            }).catch(() => setCopied(false));
        },
        [],
    );

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={copied ? "Copied" : "Copy code"}
            className="absolute right-2 top-2 rounded-md p-1.5
                       text-neutral-500 dark:text-neutral-400
                       bg-neutral-200/60 dark:bg-neutral-800/60
                       opacity-0 group-hover:opacity-100
                       hover:text-neutral-900 dark:hover:text-neutral-100
                       transition-opacity duration-200 cursor-pointer"
        >
            {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
    );
}
