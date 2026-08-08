import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  onDark = false,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  onDark?: boolean;
  action?: ReactNode;
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
      }
    >
      <div className={align === "center" ? "" : "max-w-2xl"}>
        {eyebrow && (
          <p className={onDark ? "eyebrow text-primary-foreground/60" : "eyebrow"}>{eyebrow}</p>
        )}
        <h2 className="mt-3 text-3xl leading-[1.1] md:text-[2.6rem]">{title}</h2>
        {description && (
          <p
            className={`mt-4 text-[15px] leading-relaxed ${
              onDark ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
