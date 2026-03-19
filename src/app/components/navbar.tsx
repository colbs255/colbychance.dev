"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = {
    "/": {
        name: "home",
    },
    "/posts": {
        name: "posts",
    },
    "/slides": {
        name: "slides",
    },
};

export function Navbar() {
    const pathname = usePathname();
    return (
        <aside className="-ml-[8px] mb-16 tracking-tight">
            <div className="lg:sticky lg:top-20">
                <nav
                    className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
                    id="nav"
                >
                    <div className="flex flex-row space-x-0 pr-10">
                        {Object.entries(navItems).map(([path, { name }]) => {
                            const isActive =
                                path === "/"
                                    ? pathname === "/"
                                    : pathname.startsWith(path);
                            return (
                                <Link
                                    key={path}
                                    href={path}
                                    aria-current={isActive ? "page" : undefined}
                                    className="transition-all text-neutral-500 hover:text-black dark:text-neutral-500 dark:hover:text-white flex align-middle relative py-1 px-2 m-1"
                                >
                                    {name}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </aside>
    );
}
