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
    <Sidebar collapsible="icon" {...props} className="shadow-xl  mt-[4rem]">
      <SidebarContent className="bg-[#ffffff]">
        <div className="flex justify-start items-center ps-3 sm:ps-5 gap-2 mt-4 cursor-pointer hover:bg-gray-100 rounded-lg p-1 transition-colors" onClick={handleNavigate}>
          <LayoutDashboard className="size-[20px] font-semibold flex-shrink-0"/>
          {state === "expanded" && (
            <div className="text-xs font-semibold text-gray-700 truncate">
              Dashboard
            </div>
          )}
        </div>
        <NavMain items={data.navMain} />

      </SidebarContent>

      <SidebarFooter className="bg-[#ffffff] border-t border-gray-200 p-3 sm:p-4">
        <p className="text-xs text-gray-500 text-center break-words">
          copyright@www.webspiderbd.com
        </p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
