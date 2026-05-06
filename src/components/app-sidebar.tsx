import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { navMain } from "./Routs/Routs";
import { LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const data = {
  navMain: navMain.map((item) => ({
    ...item,
    items: Array.isArray(item.items)
      ? item.items.filter(
          (
            subItem,
          ): subItem is { title: string; url: string; isShow: boolean } =>
            Boolean(subItem),
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

  // ✅ Responsive Sidebar with fixed footer at bottom
  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="shadow-2xl mt-[4rem] overflow-visible flex flex-col"
    >
      {/* ✅ SidebarContent with gradient background - scrollable */}
      <SidebarContent
        className="p-3 flex-1 overflow-y-auto"
        style={{
          background:
            "linear-gradient(180deg, #0d7a99 0%, #0f9ab5 50%, #17a2b8 100%)",
        }}
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


        {/* ✅ FIXED FOOTER - Always visible at bottom, doesn't scroll */}
        <div
          className="py-4 sm:py-5 px-3 sm:px-4 border-t border-white/30 flex-shrink-0 relative z-20"
        >
          <p className="text-xs sm:text-sm text-white text-center break-words leading-relaxed font-semibold">
            copyright@2024 | All rights reserved by Educational Management System
          </p>
          <p className="text-xs sm:text-sm text-white text-center break-words leading-relaxed font-semibold">
            Developed by{" "}
            <a
              href="https://www.facebook.com/reshad.rashed.7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline"
            >
              Rashed Uzzaman Reshad
            </a>
          </p>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
