import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
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

  const handleNavigate = () => {
    console.log("cliced");
    
    navigate("/");
  };
  return (
    <Sidebar collapsible="icon" {...props} className="shadow-xl  mt-[4rem]">
      <SidebarContent className="bg-[#ffffff]">
        <div className="flex justify-start items-center ps-5 gap-2 mt-4 cursor-pointer" onClick={handleNavigate}>
          <LayoutDashboard className="size-[15px] font-semibold"/>
            <div className="text-xs font-semibold text-gray-700">
              Dashboard
            </div>
          </div>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
