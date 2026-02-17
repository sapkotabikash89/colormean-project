import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Color Picker - Explore Colors | ColorMean",
    description: "Interactive color information and picker tool. Explore hex codes, meanings, and harmonies.",
    alternates: {
        canonical: "/colors/picker",
    },
};

export default function PickerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
