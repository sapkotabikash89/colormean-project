export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4">
            <div className="mx-auto h-8 w-2/3 max-w-md rounded bg-muted animate-pulse" />
            <div className="mx-auto h-4 w-1/2 max-w-sm rounded bg-muted animate-pulse" />
          </div>
        </div>
      </section>
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-6">
          <div className="rounded-xl border border-border p-2 md:p-4">
            <div className="w-full aspect-[3/2] bg-muted rounded-md animate-pulse" />
          </div>
          <div className="rounded-xl border border-border p-2 md:p-4">
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 w-full rounded bg-muted animate-pulse" />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border p-2 md:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden border-2 border-border">
                  <div className="w-full aspect-[3/2] bg-muted animate-pulse" />
                  <div className="p-4">
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
