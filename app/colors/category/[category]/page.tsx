import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ColorSidebar } from "@/components/sidebar"
import { ColorLibrary } from "@/components/color-library"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/structured-data"
import colorLibraryData from "@/lib/color-library-data.json"
import { ShareButtons } from "@/components/share-buttons"

interface CategoryPageProps {
    params: Promise<{ category: string }>
}

const perPage = 100

export async function generateStaticParams() {
    const categories = [...new Set(colorLibraryData.map(c => c.category))];
    return categories.map(category => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { category } = await params
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);

    return {
        title: `${capitalized} Colors - Color Library | ColorMean`,
        description: `Browse our collection of ${category} colors in the Color Library. Find names, hex codes, and meanings for various ${category} shades.`,
        alternates: {
            canonical: `/colors/category/${category}/`,
        },
        robots: {
            index: false,
            follow: true,
        }
    }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = await params
    const baseUrl = "https://colormean.com"
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);

    const filteredData = colorLibraryData.filter(c => c.category === category);
    const pageItems = filteredData.slice(0, perPage).map((c) => ({
        name: c.name,
        url: `${baseUrl}/colors/${c.hex.replace("#", "").toLowerCase()}/`,
    }))

    return (
        <div className="flex flex-col min-h-screen">
            <CollectionPageSchema name={`${capitalized} Colors`} url={`${baseUrl}/colors/category/${category}/`} />
            <ItemListSchema items={pageItems} />
            <BreadcrumbSchema items={[
                { name: "Home", item: "https://colormean.com" },
                { name: "Color Library", item: "https://colormean.com/colors/" },
                { name: capitalized, item: `https://colormean.com/colors/category/${category}/` }
            ]} />
            <Header />

            <section className="bg-muted/30 py-12 px-4">
                <div className="container mx-auto">
                    <BreadcrumbNav
                        items={[
                            { label: "Color Library", href: "/colors/" },
                            { label: capitalized, href: `/colors/category/${category}/` }
                        ]}
                    />
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold">{capitalized} Colors</h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Explore our collection of {category} colors with hex codes and names.
                        </p>
                    </div>
                </div>
            </section>

            <main className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <article id="content" className="main-content grow-content flex-1" itemProp="articleBody">
                        <ColorLibrary
                            initialQuery=""
                            initialPage={1}
                            initialCategory={category}
                            perPage={perPage}
                            baseUrl="/colors"
                        />
                        <div className="mt-8 flex justify-center">
                            <ShareButtons title={`Check out ${capitalized} colors in the ColorMean Library`} />
                        </div>
                    </article>
                    <ColorSidebar color="#5B6FD8" />
                </div>
            </main>

            <Footer />
        </div>
    )
}
