import type { ReactNode } from "react";

export type AdmonitionProps = {
    title?: string;
    children: React.ReactNode;
};

export type AdmonitionSchema = {
    defaultTitle: string;
    titleColor: string;
    borderColor: string;
    icon: ReactNode;
};

export default function Admonition(
    schema: AdmonitionSchema,
    props: AdmonitionProps,
) {
    return (
        <div
            className={`border-1 ${schema.borderColor} rounded-lg overflow-hidden mb-2`}
        >
            <div
                className={`${schema.titleColor} text-black dark:text-white font-semibold px-4 py-2 text-sm flex items-center gap-2`}
            >
                {schema.icon}
                {props.title ?? schema.defaultTitle}
            </div>
            <div className="p-3">{props.children}</div>
        </div>
    );
}
