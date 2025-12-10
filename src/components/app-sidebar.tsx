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
  return (
    <Sidebar collapsible="icon" {...props} className="shadow-xl  mt-[4rem]">
      <SidebarContent className="bg-[#ffffff]">
        <div className="flex justify-start items-center ps-5 gap-2 mt-4 cursor-pointer" onClick={handleNavigate}>
          <LayoutDashboard className="size-[20px] font-semibold"/>
          {state === "expanded" && (
            <div className="text-xs font-semibold text-gray-700">
              Dashboard
            </div>
          )}
        </div>
        <NavMain items={data.navMain} />

      </SidebarContent>

      <SidebarFooter className="bg-[#ffffff] border-t border-gray-200 p-4">
        <p className="text-xs text-gray-500 text-center">
          copyright@www.webspiderbd.com
        </p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
