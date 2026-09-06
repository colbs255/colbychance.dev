import { evaluate } from "@mdx-js/mdx";
import rehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype";
import { Info, Pencil, TriangleAlert } from "lucide-react";
import {
    type ComponentPropsWithoutRef,
    isValidElement,
    type ReactNode,
} from "react";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import generatePlantUmlSvg from "@/lib/plantuml";
import type { Doc } from "@/lib/types";
import { slugify } from "@/lib/util";
import Admonition, { type AdmonitionProps } from "./admonition";
import CopyButton from "./copy-button";
import PlantUML from "./plantuml";

type PlantUMLProps = {
    source: string;
};

function headingText(node: ReactNode): string {
    if (node == null || typeof node === "boolean") {
        return "";
    }
    if (typeof node === "string" || typeof node === "number") {
        return String(node);
    }
    if (Array.isArray(node)) {
        return node.map(headingText).join("");
    }
    if (isValidElement<{ children?: ReactNode }>(node)) {
        return headingText(node.props.children);
    }
    return "";
}

function createHeading(
    level: 2 | 3 | 4 | 5 | 6,
    usedSlugs: Map<string, number>,
) {
    const Tag = `h${level}` as const;
    return function Heading({ children }: { children?: ReactNode }) {
        const text = headingText(children);
        const slug = slugify(text);
        const count = usedSlugs.get(slug) ?? 0;
        usedSlugs.set(slug, count + 1);
        const id = count === 0 ? slug : `${slug}-${count}`;
        return (
            <Tag id={id}>
                <a href={`#${id}`} className="anchor">
                    <span className="sr-only">Link to section: {text}</span>
                </a>
                {children}
            </Tag>
        );
    };
}

function mdxComponents() {
    const iconSize = 18;
    const usedSlugs = new Map<string, number>();
    return {
        h2: createHeading(2, usedSlugs),
        h3: createHeading(3, usedSlugs),
        h4: createHeading(4, usedSlugs),
        h5: createHeading(5, usedSlugs),
        h6: createHeading(6, usedSlugs),
        pre: (props: ComponentPropsWithoutRef<"pre">) => (
            <pre {...props} className={`${props.className ?? ""} group`}>
                <CopyButton />
                {props.children}
            </pre>
        ),
        PlantUML: async ({ source }: PlantUMLProps) => (
            <PlantUML path={await generatePlantUmlSvg(source)} />
        ),
        Note: (props: AdmonitionProps) =>
            Admonition(
                {
                    defaultTitle: "Note",
                    titleColor: "bg-[#448aff]/15",
                    borderColor: "border-[#448aff]",
                    icon: <Pencil size={iconSize} color="#448aff" />,
                },
                props,
            ),
        Info: (props: AdmonitionProps) =>
            Admonition(
                {
                    defaultTitle: "Info",
                    titleColor: "bg-[#00b8d4]/15",
                    borderColor: "border-[#00b8d4]",
                    icon: <Info size={iconSize} color="#00b8d4" />,
                },
                props,
            ),
        Warning: (props: AdmonitionProps) =>
            Admonition(
                {
                    defaultTitle: "Warning",
                    titleColor: "bg-[#ff9100]/15",
                    borderColor: "border-[#ff9100]",
                    icon: <TriangleAlert size={iconSize} color="#ff9100" />,
                },
                props,
            ),
    };
}

const shikiConfig: RehypeShikiOptions = {
    inline: "tailing-curly-colon",
    themes: {
        light: "catppuccin-latte",
        dark: "tokyo-night",
    },
};

export default async function Page(doc: Doc) {
    const { default: MDXContent } = await evaluate(doc.content, {
        ...runtime,
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypeShiki, shikiConfig]],
        useMDXComponents: mdxComponents,
    });
    return <MDXContent />;
}
