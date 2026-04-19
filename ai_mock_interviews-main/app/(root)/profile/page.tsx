import { getCurrentUser, signOut } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ProfilePage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className=" glass-dark border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 blur-[100px] -z-10" />

        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-500/20 glass-dark">
              <Image 
                src={"/profile.svg"} 
                alt="Profile" 
                width={128} 
                height={128} 
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#0a0a0a]" title="Online" />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
              {user.name}
            </h1>
            <p className="text-light-400 text-lg">
              {user.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-medium text-light-500 uppercase tracking-wider mb-2">Account Type</h3>
            <p className="text-xl font-semibold text-white">Free Plan</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-medium text-light-500 uppercase tracking-wider mb-2">Member Since</h3>
            <p className="text-xl font-semibold text-white">March 2026</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="btn-primary px-8">
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
          
          <form action={async () => {
            "use server";
            await signOut();
            redirect("/sign-in");
          }}>
            <Button variant="outline" type="submit" className="w-full border-white/10 hover:bg-red-500/10 hover:text-red-500 transition-all">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
