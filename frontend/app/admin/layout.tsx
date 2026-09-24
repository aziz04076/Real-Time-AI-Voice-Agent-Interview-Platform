import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  if (user.role !== "admin" && !user.isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark-100 text-light-100 font-sans">
      <AdminSidebar pathname="" />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <AdminHeader user={user} />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar pb-24">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
