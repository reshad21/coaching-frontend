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
  
  // API returns an array, get the first item
  const siteSetting = siteSettingData?.data?.[0];
  const logo = siteSetting?.logo || defaultLogo;
  const brandName = siteSetting?.brandName || "Educational Management System";
  const favicon = siteSetting?.favicon;

  // Update favicon dynamically
  useEffect(() => {
    if (favicon) {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [favicon]);

  // Update document title with brand name
  useEffect(() => {
    document.title = brandName;
  }, [brandName]);

  return (
    <SidebarProvider className="h-screen">
      <AppSidebar />

      {/* Full-Width Header */}
      <header className="fixed top-0 left-0 w-full bg-primary shadow-md h-16 flex items-center justify-between px-6 z-50">
        {/* Left Section - Logo & Trigger */}
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <SidebarTrigger className="h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 text-white border-none transition-all duration-200 ease-in-out hover:scale-105 flex items-center justify-center">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        </div>

        {/* Center Section - Brand Name */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-white text-xl font-bold tracking-wide">
            {brandName}
          </h1>
        </div>

        {/* Right Section - Placeholder for future elements */}
        <div className="w-[120px]"></div>
      </header>

      {/* Main Content Wrapper */}
      <div className="flex min-h-screen pt-16 w-full">
        <SidebarInset />
        <main className="w-full p-5">
          <Outlet />
        </main>
      </div>

      {/* Full-Width Footer */}
      {/* <footer className="fixed bottom-0 left-0 w-full bg-[#09733D] text-center py-4 text-sm text-white shadow-md z-50">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </footer> */}
    </SidebarProvider>
  );
}
