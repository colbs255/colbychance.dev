import type { Doc, LocalDate, Metadata } from "./types";

export function parseLocalDate(s: string): LocalDate {
    const [year, month, day] = s.split("-").map(Number);
    if (!year || !month || !day) {
        throw new Error(`Invalid date: ${s} Expected YYYY-MM-DD`);
    }
    return { year, month, day };
}

export function formatLocalDate(date: LocalDate): string {
    const { month, day, year } = date;

    const MONTH_NAMES = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    if (month < 1 || month > 12) {
        throw new Error(`Invalid month: ${month}`);
    }

    return `${MONTH_NAMES[month]} ${day}, ${year}`;
}

export function formatPageTitle(s: string) {
    return `${s} | Colby Chance`;
}

export function compareLocalDate(a: LocalDate, b: LocalDate): number {
    if (a.year !== b.year) return a.year - b.year;
    if (a.month !== b.month) return a.month - b.month;
    return a.day - b.day;
}

export function slugify(title: string): string {
    return title
        .toString()
        .toLowerCase()
        .trim() // Remove whitespace from both ends of a string
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/&/g, "-and-") // Replace & with 'and'
        .replace(/[^\w-]+/g, "") // Remove all non-word characters except for -
        .replace(/--+/g, "-"); // Replace multiple - with single -
}

export function parseDoc(fileContent: string): Doc {
    const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
    const match = frontmatterRegex.exec(fileContent)?.[1];
    if (!match) {
        throw new Error("Frontmatter not found");
    }
    const content = fileContent.replace(frontmatterRegex, "").trim();
    const frontMatterLines = match.trim().split("\n");

    const result: Record<string, string> = {};
    frontMatterLines.forEach((line) => {
        const components = line.split(": ");
        const [key, value] = [components[0], components[1]];
        if (!key || !value) {
            throw new Error(`Expected line ${line} to have format k: v`);
        }
        result[key] = value;
    });
    if (!result["title"] || !result["tags"] || !result["publishedAt"]) {
        throw new Error("Doc must have title, tags, and publishedAt");
    }
    const meta: Metadata = {
        title: result["title"],
        slug: slugify(result["title"]),
        tags: result["tags"].split(", "),
        publishedAt: parseLocalDate(result["publishedAt"]),
    };
    return { meta, content };
}
