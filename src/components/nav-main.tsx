"use client";

import * as React from "react";

import { ChevronDown, LogOut, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/redux/hooks";
import { HandelLogout } from "@/utils/handelLogOut";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      isShow: boolean;
    }[];
  }[];
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openItem, setOpenItem] = React.useState<string | null>(
    items.find((item) => item.isActive)?.title ?? null
  );


  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={openItem === item.title}
            onOpenChange={(open) => setOpenItem(open ? item.title : null)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon className="text-white" />}
                  <span className="text-white">{item.title}</span>
                  <ChevronDown className="ml-auto text-white/70 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        {/* {console.log(items[0]?.items?.isShow)} */}
                        {subItem?.isShow && (
                          <Link to={subItem.url} className="nav-link">
                            <span>{subItem.title}</span>
                          </Link>
                        )}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild onClick={() => HandelLogout(navigate, dispatch)}>
          <button type="button" className="w-full flex items-center gap-3">
            <LogOut className="w-5 h-5 text-white" />
            <span className="text-white">Log out</span>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarGroup>
  );
}
