import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { ColorLibrary } from "@/components/color-library"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/structured-data"
import colorLibraryData from "@/lib/color-library-data.json"
import { ShareButtons } from "@/components/share-buttons"

interface PaginatedColorsPageProps {
    params: Promise<{ page: string }>
}

const perPage = 100
const totalColors = colorLibraryData.length
const totalPages = Math.ceil(totalColors / perPage)

export async function generateStaticParams() {
    const paths = []
    // We start from 2 because the main /colors page serves as page 1
    for (let i = 2; i <= totalPages; i++) {
        paths.push({ page: String(i) })
    }
    return paths
}

export async function generateMetadata({ params }: PaginatedColorsPageProps): Promise<Metadata> {
    const { page } = await params
    const pageNum = parseInt(page)

    return {
        title: `Color Library - Page ${pageNum} | ColorMean`,
        description: `Browse our comprehensive color library. Page ${pageNum} of ${totalPages} featuring color names, hex codes, and categories.`,
        alternates: {
            canonical: `/colors/page/${pageNum}/`,
        },
    }
}

export default async function PaginatedColorsPage({ params }: PaginatedColorsPageProps) {
    const { page } = await params
    const pageNum = parseInt(page)
    const baseUrl = "https://colormean.com"

    const start = (pageNum - 1) * perPage
    const end = start + perPage
    const pageItems = colorLibraryData.slice(start, end).map((c) => ({
        name: c.name,
        url: `${baseUrl}/colors/${c.hex.replace("#", "").toLowerCase()}/`,
    }))

    return (
        <div className="flex flex-col min-h-screen">
            <CollectionPageSchema name={`Color Library - Page ${pageNum}`} url={`${baseUrl}/colors/page/${pageNum}/`} />
            <ItemListSchema items={pageItems} />
            <BreadcrumbSchema items={[
                { name: "Home", item: "https://colormean.com" },
                { name: "Color Library", item: "https://colormean.com/colors/" },
                { name: `Page ${pageNum}`, item: `https://colormean.com/colors/page/${pageNum}/` }
            ]} />
            <Header />

            <section className="bg-muted/30 py-12 px-4">
                <div className="container mx-auto">
                    <BreadcrumbNav
                        items={[
                            { label: "Color Library", href: "/colors/" },
                            { label: `Page ${pageNum}`, href: `/colors/page/${pageNum}/` }
                        ]}
                    />
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold">Color Library - Page {pageNum}</h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Browse our extensive collection of colors. Showing page {pageNum} of {totalPages}.
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
                            initialCategory="all"
                            perPage={perPage}
                            baseUrl="/colors"
                        />
                        <div className="mt-8 flex justify-center">
                            <ShareButtons title={`Check out the ColorMean Color Library - Page ${pageNum}`} />
                        </div>
                    </article>
                    <ColorSidebar color="#5B6FD8" />
                </div>
            </main>

            <Footer />
        </div>
    )
}
