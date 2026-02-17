import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ColorSidebar } from "@/components/sidebar";
import { CategoryPosts } from "@/components/category-posts";

async function fetchPostsByCategory() {
  // First get the category ID for "Color Meaning"
  const categoryRes = await fetch("https://cms.colormean.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query GetColorMeaningCategory {
          categories(first: 1, where: { slug: "color-meaning" }) {
            nodes {
              databaseId
              name
              slug
            }
          }
        }
      `,
    }),
    next: { revalidate: 3600 }, // 1 hour cache
  });

  const categoryJson = await categoryRes.json();
  const category = categoryJson?.data?.categories?.nodes?.[0];

  if (!category?.databaseId) {
    return { posts: [], categoryName: "Color Meaning" };
  }

  // Now fetch posts by category ID
  const res = await fetch("https://cms.colormean.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query PostsByColorMeaningCategory($catId: ID!) {
          posts(first: 24, where: { categoryIn: [$catId] }) {
            nodes {
              title
              excerpt
              uri
              date
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
            }
          }
        }
      `,
      variables: { catId: category.databaseId },
    }),
    next: { revalidate: 3600 }, // 1 hour cache
  });

  const json = await res.json();
  return {
    posts: json?.data?.posts?.nodes ?? [],
    categoryName: category.name
  };
}

export const metadata = {
  title: "Color Meaning - Explore Psychology, Spirituality and Culture",
  description:
    "Explore color meanings, psychology, spirituality, and cultural symbolism. Curated articles from our headless WordPress CMS.",
  alternates: {
    canonical: "/category/color-meaning",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default async function ColorMeaningCategoryPage() {
  const { posts, categoryName } = await fetchPostsByCategory();

  // Define breadcrumbs
  const crumbs = [
    { label: categoryName, href: "/categories/color-meaning" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <BreadcrumbNav items={crumbs} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{categoryName}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Read expert guides about colors, their psychology, spirituality, history, and usage in design
            </p>
          </div>
        </div>
      </section>
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <article id="content" className="main-content grow-content flex-1">
            <CategoryPosts
              initialPosts={posts}
              categoryName={categoryName}
              categorySlug="color-meaning"
            />
          </article>
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>
      <Footer />
    </div>
  );
}