"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import postsData from "@/lib/blog-posts-data.json"

export function LatestPosts() {
    // Get 5 latest posts
    const latestPosts = postsData.slice(0, 5)

    return (
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-muted/30 border-y py-8 sm:py-12 mt-8 sm:mt-12">
            <div className="container mx-auto px-4 space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-bold">Latest from the Blog</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Insights, guides, and inspiration from the world of color psychology and design
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {latestPosts.map((post: any) => {
                        const img = post?.featuredImage?.node?.sourceUrl || post?.seo?.opengraphImage?.sourceUrl;
                        const excerpt = (post?.excerpt || "")
                            .replace(/<[^>]*>/g, "")
                            .replace(/&nbsp;/g, " ")
                            .replace(/&amp;/g, "&")
                            .substring(0, 120) + "...";

                        return (
                            <Link key={post.id} href={post.uri.endsWith('/') ? post.uri : `${post.uri}/`} className="group flex flex-col h-full bg-background rounded-xl overflow-hidden border hover:shadow-lg transition-all hover:border-primary/50">
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <img
                                        src={img}
                                        alt={post.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4 flex flex-col flex-1 space-y-2">
                                    <h3 className="line-clamp-2 text-base font-bold group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {excerpt}
                                    </p>
                                    <div className="pt-2 mt-auto">
                                        <span className="text-primary font-semibold text-xs inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            Read post <span className="text-base">→</span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                <div className="text-center pt-4">
                    <Link href="/blog/">
                        <Button variant="outline" size="lg" className="h-12 px-8 rounded-full font-semibold">
                            View all posts
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

function Button({ variant, size, className, children }: any) {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors"
    const variants = {
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    }
    const sizes = {
        lg: "h-11 px-8 rounded-md"
    }
    const classes = `${baseStyles} ${variants[variant as keyof typeof variants] || ""} ${sizes[size as keyof typeof sizes] || ""} ${className}`
    return (
        <span className={classes}>{children}</span>
    )
}
