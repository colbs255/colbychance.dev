import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import Footer from "./components/footer";
import { Navbar } from "./components/navbar";

export const metadata: Metadata = {
    title: "Colby Chance",
    description: "My personal website",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`text-black bg-white dark:text-white dark:bg-black ${GeistSans.variable} ${GeistMono.variable}`}
        >
            <body className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto">
                <a
                    href="#content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:dark:bg-black focus:dark:text-white focus:outline focus:outline-2"
                >
                    Skip to content
                </a>
                <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
                    <Navbar />
                    <div id="content">{children}</div>
                    <Footer />
                </main>
            </body>
        </html>
    );
}
