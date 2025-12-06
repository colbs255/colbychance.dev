// @ts-expect-error: lib does not have ts types and I can't figure out how to make ts happy
import * as reveal from "@asciidoctor/reveal.js";
import Asciidoctor from "asciidoctor";
import fs from "fs";
import path from "path";
import type { Metadata } from "@/lib/types";
import { parseLocalDate, slugify } from "@/lib/util";

const root = process.cwd();
const slidesDir = path.join(root, "content", "slides");
const outputDir = path.join(root, "public", "slides");
fs.mkdirSync(outputDir, { recursive: true });
fs.cpSync(
    path.join(root, "node_modules", "reveal.js", "dist"),
    path.join(outputDir, "reveal.js", "dist"),
    { recursive: true },
);
fs.cpSync(
    path.join(root, "node_modules", "reveal.js", "plugin"),
    path.join(outputDir, "reveal.js", "plugin"),
    { recursive: true },
);

const asciidoctor = Asciidoctor();
reveal.register();

const attributes = [
    "source-highlighter=highlightjs",
    "revealjs_theme=white",
    "source-highlighter=highlightjs",
    "table-caption!",
    "revealjs_margin=.05",
    "revealjs_hash=true",
    "revealjs_height=800",
    "revealjs_width=1000",
    "revealjsdir=reveal.js",
];

const records: Metadata[] = [];
fs.readdirSync(slidesDir).forEach((f) => {
    const doc = asciidoctor.loadFile(path.join(slidesDir, f), {
        safe: "safe",
        backend: "revealjs",
        standalone: true,
        attributes: attributes,
    });
    const title = doc.getTitle() ?? "unknown";
    const slug = `${slugify(title)}.html`;
    const publishedAt = parseLocalDate(doc.getAttribute("publishedat"));
    const tags: string[] = doc.getAttribute("tags", "").split(", ");
    records.push({ title, slug, publishedAt, tags });
    fs.writeFileSync(path.join(outputDir, slug), doc.convert());
});

fs.writeFileSync(
    path.join(root, "public", "slides", "index.json"),
    JSON.stringify({ data: records }),
);
