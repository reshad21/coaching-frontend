import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { navMain } from "./Routs/Routs";
import { LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const data = {
  navMain: navMain.map(item => ({
    ...item,
    items: Array.isArray(item.items)
      ? item.items.filter(
          (subItem): subItem is { title: string; url: string; isShow: boolean } => Boolean(subItem)
        )
      : item.items,
  })),
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { state } = useSidebar();

  const handleNavigate = () => {
    navigate("/");
  };
  // ✅ Responsive Sidebar: Proper spacing for mobile and desktop
  return (
    <Sidebar collapsible="icon" {...props} className="shadow-2xl mt-[4rem] overflow-hidden ">
      <SidebarContent
        className="p-3"
        style={{ background: "linear-gradient(180deg, #0d7a99 0%, #0f9ab5 50%, #17a2b8 100%)" }}
      >
        <div
          className="flex justify-start items-center ps-3 sm:ps-5 gap-2 mt-4 cursor-pointer hover:bg-white/10 rounded-md p-2 transition-all duration-200"
          onClick={handleNavigate}
        >
          <LayoutDashboard className="w-5 h-5 text-white flex-shrink-0" />
          {state === "expanded" && (
            <div className="text-sm font-semibold text-white truncate">
              Dashboard
            </div>
          )}
        </div>
        <NavMain items={data.navMain} />

      </SidebarContent>

      <SidebarFooter className="bg-transparent p-3 sm:p-4">
        <p className="text-xs text-white/90 text-center break-words">
          copyright@www.webspiderbd.com
        </p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
