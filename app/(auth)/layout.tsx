import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "wikidev",
    description: "Your one-stop place as a techie",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
            <div>
                {children}
            </div>
    );
}
