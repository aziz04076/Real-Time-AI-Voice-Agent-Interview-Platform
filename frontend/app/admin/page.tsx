export const dynamic = "force-dynamic";

import { Metadata } from "next";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Control Panel - PrepWise AI",
  description: "Manage users and view platform analytics.",
};

export default function AdminPage() {
  return (
    <AdminDashboardClient />
  );
}

