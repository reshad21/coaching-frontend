import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <SidebarProvider className="h-screen">
      {/* Sidebar */}
      <AppSidebar />

      {/* Full-Width Header */}
      <header className="fixed top-0 left-0 w-full bg-primary   shadow-md h-16 flex items-center px-6 z-50">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-6" />
        <Breadcrumb className="hidden">
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* Main Content Wrapper */}
      <div className="flex min-h-screen pt-16 w-full">
        {/* Push content below header */}
        <SidebarInset />
        {/* Content with Left Padding for Sidebar */}
        <main className="w-full p-5">
          {/* Adjust 64px based on sidebar width */}
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
