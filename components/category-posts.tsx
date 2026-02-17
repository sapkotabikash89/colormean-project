import { Card } from "@/components/ui/card";
import Link from "next/link";
import { FeaturedImage } from "@/components/blog/featured-image";

interface Post {
  title: string;
  excerpt: string;
  uri: string;
  date: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
      altText: string;
    };
  };
}

interface CategoryPostsProps {
  initialPosts: Post[];
  categoryName: string;
  categorySlug: string;
}

export function CategoryPosts({ initialPosts, categoryName, categorySlug }: CategoryPostsProps) {
  const posts = initialPosts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post: any, i: number) => {
        const img = post?.featuredImage?.node?.sourceUrl;
        const alt = post?.featuredImage?.node?.altText || post?.title;
        const excerpt = (post?.excerpt || "")
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .trim();

        return (
          <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={post?.uri?.endsWith('/') ? post.uri : `${post.uri}/`} className="block">
              {img && (
                <FeaturedImage
                  src={img}
                  alt={alt}
                  className="w-full"
                />
              )}
              <div className="p-4 space-y-2">
                {post?.categoryName && (
                  <div className="inline-block px-2 py-1 text-xs bg-muted rounded">
                    {post.categoryName}
                  </div>
                )}
                <h2 className="text-lg font-bold line-clamp-2">{post?.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
                <div className="text-xs text-muted-foreground">{new Date(post?.date).toLocaleDateString()}</div>
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}