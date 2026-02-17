import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "HTML Color Picker - ColorMean",
    description: "Advanced HTML color picker tool to select and explore colors. Get HEX, RGB, HSL color codes instantly.",
    alternates: {
        canonical: "/html-color-picker",
    },
    robots: {
        index: false,
    },
};

export default function HtmlColorPickerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
