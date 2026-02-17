import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ColorSidebar } from "@/components/sidebar";

async function fetchAllCategories() {
  const res = await fetch("https://cms.colormean.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query AllCategories {
          categories(first: 100) {
            nodes {
              name
              slug
              count
            }
          }
        }
      `,
    }),
    next: { revalidate: 3600 }, // 1 hour cache
  });

  const json = await res.json();
  return json?.data?.categories?.nodes ?? [];
}

export const metadata = {
  title: "Color Categories - Browse All Topics",
  description: "Explore all color categories and topics on ColorMean. Find articles about color meanings, psychology, and more.",
  alternates: {
    canonical: "/categories",
  },
  robots: {
    index: false,
  },
};

export default async function AllCategoriesPage() {
  const categories = await fetchAllCategories();

  // Filter out categories with no posts
  const activeCategories = categories.filter((category: any) => category.count > 0);

  const crumbs = [
    { label: "Categories", href: "/categories" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <BreadcrumbNav items={crumbs} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Color Categories</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Browse articles by category and explore specific color topics
            </p>
          </div>
        </div>
      </section>
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <article id="content" className="main-content grow-content flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCategories.map((category: any, i: number) => (
                <a
                  key={i}
                  href={`/categories/${category.slug}`}
                  className="block p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-bold mb-2">{category.name}</h2>
                  <p className="text-muted-foreground">{category.count} post{category.count !== 1 ? 's' : ''}</p>
                </a>
              ))}
            </div>
          </article>
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>
      <Footer />
    </div>
  );
}