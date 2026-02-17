import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ColorSidebar } from "@/components/sidebar";
import { CategoryPosts } from "@/components/category-posts";

async function fetchPostsByCategory(categorySlug: string) {
  // First get the category info by slug
  const categoryRes = await fetch("https://cms.colormean.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query GetCategoryBySlug($slug: String!) {
          categories(first: 1, where: { slug: $slug }) {
            nodes {
              databaseId
              name
              slug
            }
          }
        }
      `,
      variables: { slug: categorySlug },
    }),
    next: { revalidate: 3600 }, // 1 hour cache
  });

  const categoryJson = await categoryRes.json();
  const category = categoryJson?.data?.categories?.nodes?.[0];

  if (!category?.databaseId) {
    return { posts: [], categoryName: categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') };
  }

  // Now fetch posts by category ID
  const res = await fetch("https://cms.colormean.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query PostsByCategory($catId: ID!) {
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
    categoryName: category.name || categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  };
}

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

export async function generateStaticParams() {
  const categories = await fetchAllCategories();
  return categories.map((category: any) => ({
    category: category.slug,
  }));
}

type CategoryPageProps = {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const capitalizedCategory = categorySlug
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${capitalizedCategory} - ColorMean`,
    description: `Explore ${capitalizedCategory.toLowerCase()} articles and guides on ColorMean. Latest posts about ${capitalizedCategory.toLowerCase()} meanings, psychology, and symbolism.`,
    alternates: {
      canonical: `/categories/${categorySlug}`,
    },
    robots: {
      index: false,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const { posts, categoryName } = await fetchPostsByCategory(categorySlug);

  // Define breadcrumbs
  const crumbs = [
    { label: categoryName, href: `/categories/${categorySlug}` },
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
              Read expert guides about {categoryName.toLowerCase()}, their psychology, symbolism, and cultural significance
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
              categorySlug={categorySlug}
            />
          </article>
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>
      <Footer />
    </div>
  );
}