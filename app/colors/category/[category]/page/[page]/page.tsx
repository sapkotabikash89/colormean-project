import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { ColorLibrary } from "@/components/color-library"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/structured-data"
import colorLibraryData from "@/lib/color-library-data.json"
import { ShareButtons } from "@/components/share-buttons"

interface PaginatedCategoryPageProps {
    params: Promise<{ category: string; page: string }>
}

const perPage = 100

export async function generateStaticParams() {
    const categories = [...new Set(colorLibraryData.map(c => c.category))];
    const paths = [];

    for (const category of categories) {
        const filtered = colorLibraryData.filter(c => c.category === category);
        const totalPages = Math.ceil(filtered.length / perPage);
        // Start from 2 as page 1 is the main category route
        for (let i = 2; i <= totalPages; i++) {
            paths.push({ category, page: String(i) });
        }
    }

    return paths;
}

export async function generateMetadata({ params }: PaginatedCategoryPageProps): Promise<Metadata> {
    const { category, page } = await params
    const pageNum = parseInt(page)
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);

    return {
        title: `${capitalized} Colors - Page ${pageNum} | Color Library | ColorMean`,
        description: `Browse ${category} colors in the Color Library. Page ${pageNum} of ${capitalized} shades with hex codes and names.`,
        alternates: {
            canonical: `/colors/category/${category}/page/${pageNum}/`,
        },
        robots: {
            index: false,
            follow: true,
        }
    }
}

export default async function PaginatedCategoryPage({ params }: PaginatedCategoryPageProps) {
    const { category, page } = await params
    const pageNum = parseInt(page)
    const baseUrl = "https://colormean.com"
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);

    const filteredData = colorLibraryData.filter(c => c.category === category);
    const totalPages = Math.ceil(filteredData.length / perPage);
    const start = (pageNum - 1) * perPage
    const end = start + perPage
    const pageItems = filteredData.slice(start, end).map((c) => ({
        name: c.name,
        url: `${baseUrl}/colors/${c.hex.replace("#", "").toLowerCase()}/`,
    }))

    return (
        <div className="flex flex-col min-h-screen">
            <CollectionPageSchema name={`${capitalized} Colors - Page ${pageNum}`} url={`${baseUrl}/colors/category/${category}/page/${pageNum}/`} />
            <ItemListSchema items={pageItems} />
            <BreadcrumbSchema items={[
                { name: "Home", item: "https://colormean.com" },
                { name: "Color Library", item: "https://colormean.com/colors/" },
                { name: capitalized, item: `https://colormean.com/colors/category/${category}/` },
                { name: `Page ${pageNum}`, item: `https://colormean.com/colors/category/${category}/page/${pageNum}/` }
            ]} />
            <Header />

            <section className="bg-muted/30 py-12 px-4">
                <div className="container mx-auto">
                    <BreadcrumbNav
                        items={[
                            { label: "Color Library", href: "/colors/" },
                            { label: capitalized, href: `/colors/category/${category}/` },
                            { label: `Page ${pageNum}`, href: `/colors/category/${category}/page/${pageNum}/` }
                        ]}
                    />
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold">{capitalized} Colors - Page {pageNum}</h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Browse our collection of {category} colors. Showing page {pageNum} of {totalPages}.
                        </p>
                    </div>
                </div>
            </section>

            <main className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <article id="content" className="main-content grow-content flex-1" itemProp="articleBody">
                        <ColorLibrary
                            initialQuery=""
                            initialPage={pageNum}
                            initialCategory={category}
                            perPage={perPage}
                            baseUrl="/colors"
                        />
                        <div className="mt-8 flex justify-center">
                            <ShareButtons title={`Check out ${capitalized} colors in the ColorMean Library - Page ${pageNum}`} />
                        </div>
                    </article>
                    <ColorSidebar color="#5B6FD8" />
                </div>
            </main>

            <Footer />
        </div>
    )
}
