import { notFound } from "next/navigation";
import Post from "@/app/components/post";
import Title from "@/app/components/title";
import { getPosts } from "@/lib/posts";
import { formatLocalDate, formatPageTitle } from "@/lib/util";

type Params = {
    slug: string;
};

export function generateStaticParams(): Params[] {
    return getPosts().map((doc) => ({ slug: doc.meta.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}) {
    const { slug } = await params;
    const doc = getPosts().find((doc) => doc.meta.slug === slug);
    if (!doc) {
        notFound();
    }
    return {
        title: formatPageTitle(doc.meta.title),
    };
}

export default async function Page({ params }: { params: Promise<Params> }) {
    const { slug } = await params;
    const doc = getPosts().find((doc) => doc.meta.slug === slug);
    if (!doc) {
        notFound();
    }

    return (
        <section>
            <Title subheading={formatLocalDate(doc.meta.publishedAt)}>
                {doc.meta.title}
            </Title>
            <article className="prose motion-safe:animate-enter">
                <Post {...doc} />
            </article>
        </section>
    );
}
