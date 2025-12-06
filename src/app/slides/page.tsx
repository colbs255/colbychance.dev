import fs from "fs";
import type { Metadata as NextMetadata } from "next";
import path from "path";
import type { Metadata } from "@/lib/types";
import { compareLocalDate, formatPageTitle } from "@/lib/util";
import Grid, { type Item } from "../components/grid";
import Title from "../components/title";

export const metadata: NextMetadata = {
    title: formatPageTitle("Slides"),
};

export default function Page() {
    const filePath = path.join(process.cwd(), "public", "slides", "index.json");
    const index: Metadata[] = JSON.parse(
        fs.readFileSync(filePath, "utf8"),
    ).data;
    const items: Item[] = index
        .map((v) => ({
            name: v.title,
            date: v.publishedAt,
            href: `/slides/${v.slug}`,
            tags: v.tags,
        }))
        .sort((a, b) => compareLocalDate(b.date, a.date));
    return (
        <div>
            <Title>Slides</Title>
            <Grid items={items} openInNewTab={true} />
        </div>
    );
}
