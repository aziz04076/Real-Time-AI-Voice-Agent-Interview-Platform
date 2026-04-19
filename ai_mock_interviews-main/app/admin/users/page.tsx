import { Metadata } from "next";
import UsersTable from "@/components/admin/UsersTable";

export const metadata: Metadata = {
  title: "User Management - Admin",
};

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">User Directory</h1>
        <p className="text-light-400">View and manage all registered accounts on the platform.</p>
      </div>

      <UsersTable refreshTrigger={0} />
    </div>
  );
}
