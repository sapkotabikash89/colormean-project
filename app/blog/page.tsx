import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ColorSidebar } from "@/components/sidebar";
import { CategoryPosts } from "@/components/category-posts";
import fs from "fs";
import path from "path";

async function fetchAllPosts() {
  try {
    const dataPath = path.join(process.cwd(), 'lib/blog-posts-data.json');
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading local posts data:', e);
  }

  // Fallback to fetch if local file doesn't exist (e.g. first build)
  const res = await fetch("https://cms.colormean.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query AllPosts {
          posts(first: 100) {
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
              categories {
                nodes {
                  name
                  slug
                }
              }
            }
          }
        }
      `,
    }),
    next: { revalidate: 3600 }, // 1 hour cache
  });

  const json = await res.json();
  return json?.data?.posts?.nodes ?? [];
}

export const metadata = {
  title: "Blog - Latest Articles on Color Meanings, Psychology & Design",
  description: "Read all articles about colors, their meanings, psychology, spirituality, and cultural symbolism. Latest posts from ColorMean.",
  alternates: {
    canonical: "/blog/",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default async function BlogPage() {
  const posts = await fetchAllPosts();

  // Transform posts to include category information
  const transformedPosts = posts.map((post: any) => ({
    ...post,
    categoryName: post?.categories?.nodes?.[0]?.name || "Uncategorized",
    categorySlug: post?.categories?.nodes?.[0]?.slug || "uncategorized"
  }));

  const crumbs = [
    { label: "Blog", href: "/blog/" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <BreadcrumbNav items={crumbs} />
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Blog</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Read all articles about colors, their meanings, psychology, spirituality, and cultural symbolism
            </p>
          </div>
        </div>
      </section>
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <article id="content" className="main-content grow-content flex-1" itemProp="articleBody">
            <CategoryPosts
              initialPosts={transformedPosts}
              categoryName="Blog"
              categorySlug="blog"
            />
          </article>
          <ColorSidebar color="#5B6FD8" />
        </div>
      </main>
      <Footer />
    </div>
  );
}