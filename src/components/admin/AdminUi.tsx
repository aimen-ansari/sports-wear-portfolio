import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

export type Notice = { type: "success" | "error"; message: string } | null;

export function Toast({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(onClose, 4500);
    return () => window.clearTimeout(timer);
  }, [notice, onClose]);
  if (!notice) return null;
  const Icon = notice.type === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div
      className="fixed right-4 bottom-4 z-[70] flex max-w-sm items-start gap-3 border border-border bg-card p-4 shadow-lift"
      role={notice.type === "error" ? "alert" : "status"}
    >
      <Icon
        className={`mt-0.5 h-5 w-5 shrink-0 ${notice.type === "success" ? "text-accent" : "text-destructive"}`}
      />
      <p className="text-sm">{notice.message}</p>
      <button type="button" onClick={onClose} aria-label="Dismiss notification">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [busy, onCancel, open]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/55 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md border border-border bg-card p-6 shadow-lift"
      >
        <h2 id="confirm-title" className="text-xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{message}</p>
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={busy} className="btn-base btn-outline">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="btn-base bg-destructive text-destructive-foreground"
          >
            {busy ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminEmpty({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-border-strong bg-card p-10 text-center">
      <h2 className="text-lg">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingRows({ count = 5 }: { count?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="h-16 bg-muted" />
      ))}
    </div>
  );
}
