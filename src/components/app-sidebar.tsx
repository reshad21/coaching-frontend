import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { navMain } from "./Routs/Routs";

const data = {
  navMain: navMain,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="shadow-xl  mt-[4rem]">
      <SidebarContent className="bg-[#ffffff] ">
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
