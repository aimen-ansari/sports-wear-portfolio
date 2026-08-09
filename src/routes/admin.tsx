import { createFileRoute } from "@tanstack/react-router";
import { AdminRouteLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin")({ component: AdminRouteLayout });
