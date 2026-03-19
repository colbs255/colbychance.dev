import type { Doc } from "@/lib/types";
import { parseDoc } from "@/lib/util";

test("parseDoc", () => {
    const testData = `---
title: Test Title
publishedAt: 2025-04-01
tags: vim, git, testing
---

## Document`;
    const expected: Doc = {
        meta: {
            title: "Test Title",
            slug: "test-title",
            publishedAt: {
                day: 1,
                month: 4,
                year: 2025,
            },
            tags: ["vim", "git", "testing"],
        },
        content: "## Document",
    };
    expect(parseDoc(testData)).toStrictEqual(expected);
});

test("parseDoc handles values containing colons", () => {
    const testData = `---
title: Foo: Bar: Baz
publishedAt: 2025-04-01
tags: testing
---

Content`;
    const result = parseDoc(testData);
    expect(result.meta.title).toBe("Foo: Bar: Baz");
});

test("parseDoc throws on missing frontmatter", () => {
    expect(() => parseDoc("no frontmatter here")).toThrow(
        "Frontmatter not found",
    );
});

test("parseDoc throws on missing required fields", () => {
    const testData = `---
title: Test
---

Content`;
    expect(() => parseDoc(testData)).toThrow(
        "Doc must have title, tags, and publishedAt",
    );
});

test("parseDoc throws on malformed frontmatter line", () => {
    const testData = `---
title: Test
bad line without separator
publishedAt: 2025-04-01
tags: testing
---

Content`;
    expect(() => parseDoc(testData)).toThrow("Expected line");
});
