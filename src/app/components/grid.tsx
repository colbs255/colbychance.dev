import Link from "next/link";
import type { LocalDate } from "@/lib/types";
import { formatLocalDate } from "@/lib/util";

export interface Item {
    name: string;
    date: LocalDate;
    tags: string[];
    href: string;
}

interface Props {
    className?: string;
    items: Item[];
    openInNewTab?: boolean;
}

export default function Grid({
    className = "",
    items,
    openInNewTab = false,
}: Props) {
    return (
        <div className={className}>
            {items.map((item, index) => (
                <Link
                    style={{ animationDelay: `${index * 90}ms` }}
                    key={item.name}
                    className="flex flex-col space-y-1 mb-4 motion-safe:animate-enter"
                    href={item.href}
                    target={openInNewTab ? "_blank" : "_self"}
                    rel={openInNewTab ? "noopener noreferrer" : undefined}
                >
                    <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
                        <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                            {formatLocalDate(item.date)}
                        </p>
                        <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                            {item.name}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}
