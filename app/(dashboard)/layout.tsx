import { getApiLimitCount } from "@/lib/apiLimit";
import { checkSubscription } from "@/lib/subscription";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 bg-gray-400">
        <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
      </div>
      <main className="md:pl-60">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
