import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useGetSiteSettingQuery } from "@/redux/api/siteSettingApi/siteSettingApi";
import { Outlet } from "react-router-dom";
import defaultLogo from "@/assets/logo.svg";
import { Menu } from "lucide-react";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: siteSettingData } = useGetSiteSettingQuery(undefined);

  const siteSetting = siteSettingData?.data?.[0];
  const logo = siteSetting?.logo || defaultLogo;
  const brandName = siteSetting?.brandName || "Educational Management System";
  const favicon = siteSetting?.favicon;

  useEffect(() => {
    if (favicon) {
      const link: HTMLLinkElement =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = favicon;
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }, [favicon]);

  useEffect(() => {
    document.title = brandName;
  }, [brandName]);

  return (
    // ✅ overflow-x-hidden on the provider kills the page-level x scroll
    <SidebarProvider className="min-h-screen overflow-x-hidden">
      <AppSidebar />

      {/* ✅ Responsive Header: Mobile-friendly padding, responsive font sizes, and flexible layout */}
      <header className="fixed top-0 left-0 w-full bg-primary shadow-md h-16 flex items-center justify-between px-3 sm:px-6 z-50">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <img src={logo} alt="Logo" className="h-8 sm:h-10 w-auto flex-shrink-0" />
          <SidebarTrigger className="h-8 sm:h-9 w-8 sm:w-9 rounded-lg bg-white/10 hover:bg-white/20 text-white border-none transition-all duration-200 ease-in-out hover:scale-105 flex items-center justify-center flex-shrink-0">
            <Menu className="h-4 sm:h-5 w-4 sm:w-5" />
          </SidebarTrigger>
        </div>

        {/* ✅ Responsive brand name: Hidden on mobile, visible on sm and up */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
          <h1 className="text-white text-sm sm:text-lg md:text-xl font-bold tracking-wide whitespace-nowrap px-4">
            {brandName}
          </h1>
        </div>

        <div className="w-16 sm:w-[120px]"></div>
      </header>

      <div className="flex w-full min-w-0 overflow-x-hidden">
        <SidebarInset />
        {/* ✅ Responsive main: Adjusted margin-top for smaller screens, responsive spacing */}
        <main className="w-full min-w-0 overflow-x-hidden mt-16">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}