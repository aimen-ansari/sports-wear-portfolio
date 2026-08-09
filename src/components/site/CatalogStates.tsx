import { AlertTriangle, PackageOpen } from "lucide-react";

export function CatalogSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading catalog">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="animate-pulse border border-border bg-card">
          <div className="aspect-4/3 bg-muted" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-1/3 bg-muted" />
            <div className="h-5 w-2/3 bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CatalogMessage({ type, message }: { type: "empty" | "error"; message: string }) {
  const Icon = type === "error" ? AlertTriangle : PackageOpen;
  return (
    <div className="card-surface flex flex-col items-center px-6 py-12 text-center" role="status">
      <Icon className={`h-7 w-7 ${type === "error" ? "text-destructive" : "text-accent"}`} />
      <p className="mt-4 max-w-lg text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
