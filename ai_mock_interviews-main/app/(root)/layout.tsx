export const dynamic = "force-dynamic";

import { ReactNode } from "react";
import React from "react";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();

  return (
    <div className="root-layout">
      <Navbar user={user} />
      
      <main className="mt-20">
        {children}
      </main>

      <footer className="w-full py-10 glass-dark border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-16 max-sm:px-4 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm text-light-400">© 2026 PrepWise. Built with ❤️ for Students.</p>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-light-400 hover:text-primary-200">Terms</a>
            <a href="#" className="text-sm text-light-400 hover:text-primary-200">Privacy</a>
            <a href="#" className="text-sm text-light-400 hover:text-primary-200">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
