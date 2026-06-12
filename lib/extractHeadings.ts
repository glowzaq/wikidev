export interface Heading {
    text: string;
    level: number;
    id: string;
}

export function extractHeadings(content: string): Heading[] {
    const lines = content.split("\n");
    const headings: Heading[] = [];

    lines.forEach((line) => {
        const match = line.match(/^(#{1,3})\s+(.+)$/);

        if (match) {
            const level = match[1].length;
            const text = match[2].replace(/[*_~`]/g, "");

            const id = text
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-");

            headings.push({
                text,
                level,
                id,
            });
        }
    });

    return headings;
}