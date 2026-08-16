import { createFileRoute } from "@tanstack/react-router";
import { Archive, ExternalLink, Mail, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminLayout";
import {
  AdminEmpty,
  ConfirmDialog,
  LoadingRows,
  Toast,
  type Notice,
} from "@/components/admin/AdminUi";
import type { InquiryRow, InquiryStatus } from "@/lib/database.types";
import { CONTACT } from "@/data/catalog";
import { getSupabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/inquiries")({
  head: () => ({
    meta: [{ title: "Inquiries | RION APPARELS Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: InquiriesAdmin,
});
const statuses: InquiryStatus[] = ["new", "read", "replied", "archived"];

function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<InquiryStatus | "">("");
  const [selected, setSelected] = useState<InquiryRow>();
  const [deleting, setDeleting] = useState<InquiryRow>();
  const [busyDelete, setBusyDelete] = useState(false);
  const [busyStatusIds, setBusyStatusIds] = useState<Set<string>>(() => new Set());
  const statusMutations = useRef(new Set<string>());
  const loadRequest = useRef(0);
  const [notice, setNotice] = useState<Notice>(null);
  const [page, setPage] = useState(1);
  const load = async (showLoading = true) => {
    const request = ++loadRequest.current;
    if (showLoading) setLoading(true);
    const { data, error } = await getSupabase()
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (request !== loadRequest.current) return;
    setLoading(false);
    if (error) {
      setNotice({ type: "error", message: error.message });
    } else {
      const next = data ?? [];
      setInquiries(next);
      setSelected((current) =>
        current ? next.find((inquiry) => inquiry.id === current.id) : undefined,
      );
    }
  };
  useEffect(() => {
    void load();
    const supabase = getSupabase();
    const channel = supabase
      .channel("admin-inquiries-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "inquiries" }, () => {
        void load(false);
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);
  const filtered = useMemo(
    () =>
      inquiries.filter(
        (inquiry) =>
          (!filter || inquiry.status === filter) &&
          (!query ||
            `${inquiry.full_name} ${inquiry.company_name} ${inquiry.email}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [filter, inquiries, query],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 15));
  const visible = filtered.slice((page - 1) * 15, page * 15);
  useEffect(() => setPage(1), [filter, query]);
  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);
  const updateStatus = async (inquiry: InquiryRow, status: InquiryStatus) => {
    if (statusMutations.current.has(inquiry.id)) return;
    statusMutations.current.add(inquiry.id);
    setBusyStatusIds((ids) => new Set(ids).add(inquiry.id));
    try {
      const { data, error } = await getSupabase()
        .from("inquiries")
        .update({ status })
        .eq("id", inquiry.id)
        .select("*")
        .single();
      if (error) throw error;
      loadRequest.current += 1;
      setInquiries((items) => items.map((item) => (item.id === inquiry.id ? data : item)));
      setSelected((current) => (current?.id === inquiry.id ? data : current));
      setNotice({ type: "success", message: `Inquiry marked ${status}.` });
      void load(false);
    } catch (caught) {
      setNotice({
        type: "error",
        message: caught instanceof Error ? caught.message : "Inquiry status could not be updated.",
      });
    } finally {
      statusMutations.current.delete(inquiry.id);
      setBusyStatusIds((ids) => {
        const next = new Set(ids);
        next.delete(inquiry.id);
        return next;
      });
    }
  };
  const open = (inquiry: InquiryRow) => {
    setSelected(inquiry);
    if (inquiry.status === "new") void updateStatus(inquiry, "read");
  };
  const remove = async () => {
    if (!deleting) return;
    setBusyDelete(true);
    const inquiry = deleting;
    const supabase = getSupabase();
    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", inquiry.id)
      .select("id")
      .single();
    let storageError: string | undefined;
    if (!error && inquiry.reference_file_url) {
      const result = await supabase.storage
        .from("inquiry-attachments")
        .remove([inquiry.reference_file_url]);
      storageError = result.error?.message;
    }
    setBusyDelete(false);
    setDeleting(undefined);
    if (error) setNotice({ type: "error", message: error.message });
    else {
      loadRequest.current += 1;
      setInquiries((items) => items.filter((item) => item.id !== inquiry.id));
      if (selected?.id === inquiry.id) setSelected(undefined);
      setNotice({
        type: storageError ? "error" : "success",
        message: storageError
          ? `Inquiry deleted, but attachment cleanup failed: ${storageError}`
          : "Inquiry deleted.",
      });
      void load(false);
    }
  };
  const openAttachment = async (inquiry: InquiryRow) => {
    if (!inquiry.reference_file_url) return;
    const popup = window.open("about:blank", "_blank");
    if (!popup) {
      setNotice({ type: "error", message: "Allow pop-ups to open this attachment." });
      return;
    }
    popup.opener = null;
    const { data, error } = await getSupabase()
      .storage.from("inquiry-attachments")
      .createSignedUrl(inquiry.reference_file_url, 60);
    if (error) {
      popup.close();
      setNotice({ type: "error", message: error.message });
    } else {
      popup.location.href = data.signedUrl;
    }
  };
  return (
    <>
      <AdminPageHeader eyebrow="Customer requests" title="Inquiries" />
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <label className="relative">
          <span className="sr-only">Search inquiries</span>
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="field-base pl-10"
            placeholder="Search name, company or email"
          />
        </label>
        <label>
          <span className="sr-only">Filter inquiry status</span>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as InquiryStatus | "")}
            className="field-base"
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status[0]?.toUpperCase()}
                {status.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {loading ? (
        <LoadingRows />
      ) : !visible.length ? (
        <AdminEmpty
          title="No inquiries found"
          message={
            query || filter
              ? "Change the search or status filter."
              : "New website inquiries will appear here."
          }
        />
      ) : (
        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-border bg-surface text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Company</th>
                <th className="p-4">Product / category</th>
                <th className="p-4">Submitted</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((inquiry) => (
                <tr key={inquiry.id} className={inquiry.status === "new" ? "bg-accent/5" : ""}>
                  <td className="p-4">
                    <button type="button" onClick={() => open(inquiry)} className="text-left">
                      <span className="font-medium hover:text-accent">{inquiry.full_name}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {inquiry.email}
                      </span>
                    </button>
                  </td>
                  <td className="p-4 text-muted-foreground">{inquiry.company_name}</td>
                  <td className="p-4 text-muted-foreground">
                    {inquiry.product_name ?? inquiry.product_category ?? "General inquiry"}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-[10px] font-bold uppercase ${inquiry.status === "new" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => open(inquiry)}
                        className="btn-base btn-outline py-2"
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(inquiry)}
                        className="grid h-9 w-9 place-items-center border border-border text-destructive"
                        aria-label={`Delete inquiry from ${inquiry.full_name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pageCount > 1 && (
        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((value) => value - 1)}
            className="btn-base btn-outline"
          >
            Previous
          </button>
          <span>
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            disabled={page === pageCount}
            onClick={() => setPage((value) => value + 1)}
            className="btn-base btn-outline"
          >
            Next
          </button>
        </div>
      )}
      {selected && (
        <InquiryDetail
          inquiry={selected}
          busyStatus={busyStatusIds.has(selected.id)}
          onClose={() => setSelected(undefined)}
          onStatus={(status) => void updateStatus(selected, status)}
          onAttachment={() => void openAttachment(selected)}
          onDelete={() => setDeleting(selected)}
        />
      )}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete inquiry?"
        message={`This permanently deletes the inquiry from ${deleting?.full_name ?? "this customer"} and its private attachment.`}
        busy={busyDelete}
        onCancel={() => setDeleting(undefined)}
        onConfirm={remove}
      />
      <Toast notice={notice} onClose={() => setNotice(null)} />
    </>
  );
}

function InquiryDetail({
  inquiry,
  busyStatus,
  onClose,
  onStatus,
  onAttachment,
  onDelete,
}: {
  inquiry: InquiryRow;
  busyStatus: boolean;
  onClose: () => void;
  onStatus: (status: InquiryStatus) => void;
  onAttachment: () => void;
  onDelete: () => void;
}) {
  const subject = encodeURIComponent(`Re: RION APPARELS inquiry ${inquiry.id}`);
  const body = encodeURIComponent(
    `Hello ${inquiry.full_name},\n\nThank you for contacting RION APPARELS.\n\n`,
  );
  const reply = `mailto:${encodeURIComponent(inquiry.email)}?subject=${subject}&body=${body}`;
  const rows = [
    ["Company", inquiry.company_name],
    ["Email", inquiry.email],
    ["Phone / WhatsApp", inquiry.phone],
    ["Country", inquiry.country],
    ["Product", inquiry.product_name],
    ["SKU", inquiry.product_sku],
    ["Category", inquiry.product_category],
    ["Estimated quantity", inquiry.estimated_quantity],
    ["Customization", inquiry.customization_requirements],
    ["Email notification", inquiry.notification_status],
    ["Notification error", inquiry.notification_error],
    ["Submitted", new Date(inquiry.created_at).toLocaleString()],
  ];
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/55 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-title"
        className="mx-auto my-4 max-w-3xl border border-border bg-card shadow-lift"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-5">
          <div>
            <p className="eyebrow">Inquiry details</p>
            <h2 id="inquiry-title" className="mt-1 text-xl">
              {inquiry.full_name}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close inquiry details">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 sm:p-7">
          <dl className="grid gap-x-8 sm:grid-cols-2">
            {rows
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="border-b border-border py-3">
                  <dt className="eyebrow">{label}</dt>
                  <dd className="mt-1 break-words text-sm">{value}</dd>
                </div>
              ))}
          </dl>
          <div className="mt-6">
            <p className="eyebrow">Message</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {inquiry.message}
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={reply} className="btn-base btn-accent">
              <Mail className="h-4 w-4" /> Reply by Email
            </a>
            {inquiry.reference_file_url && (
              <button type="button" onClick={onAttachment} className="btn-base btn-outline">
                <ExternalLink className="h-4 w-4" /> Open Attachment
              </button>
            )}
            {inquiry.product_page_url && (
              <a
                href={inquiry.product_page_url}
                target="_blank"
                rel="noreferrer"
                className="btn-base btn-outline"
              >
                <ExternalLink className="h-4 w-4" /> Product Page
              </a>
            )}
          </div>
          <div className="mt-8 border-t border-border pt-6">
            <p className="eyebrow">Update status</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onStatus(status)}
                  disabled={busyStatus || inquiry.status === status}
                  className="btn-base btn-outline py-2 disabled:bg-muted"
                >
                  {status === "archived" && <Archive className="h-4 w-4" />}
                  {status}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onDelete}
            disabled={busyStatus}
            className="mt-8 inline-flex items-center gap-2 text-sm text-destructive"
          >
            <Trash2 className="h-4 w-4" /> Delete inquiry
          </button>
          <p className="mt-6 font-mono text-[11px] text-muted-foreground">
            Reference: {inquiry.id} · Reply mailbox: {CONTACT.email}
          </p>
        </div>
      </div>
    </div>
  );
}
