import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const allItems: BreadcrumbItem[] = [{ label: "ColorMean", href: "/" }, ...items]
  return (
    <nav className="text-sm mb-6" aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          return (
            <li
              key={`${item.href}-${index}`}
              className="opacity-80 flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {isLast ? (
                <span className="font-medium" itemProp="name">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-foreground transition-colors" itemProp="item">
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={`${index + 1}`} />
              {!isLast ? (
                <span className="mx-2 text-muted-foreground" aria-hidden="true">
                  <ChevronRight className="inline-block h-4 w-4 align-middle" />
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
