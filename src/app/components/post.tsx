import { evaluate } from "@mdx-js/mdx";
import rehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype";
import { Info, Pencil, TriangleAlert } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import generatePlantUmlSvg from "@/lib/plantuml";
import type { Doc } from "@/lib/types";
import Admonition, { type AdmonitionProps } from "./admonition";
import CopyButton from "./copy-button";
import PlantUML from "./plantuml";

type PlantUMLProps = {
    source: string;
};

function mdxComponents() {
    const iconSize = 18;
    return {
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
