"use client";

import * as React from "react";
import { Bot, LayoutDashboard, SquareTerminal } from "lucide-react";
import { NavMain } from "@/app/_components/nav-main";
import { NavUser } from "@/app/_components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/app/_components/ui/sidebar";
import Image from "next/image";
import { NavSingleItem } from "@/app/_components/nav-sigle-item";
import { DottedSeparator } from "@/app/_components/dotted-separator";

// This is sample data.
const data = {
  user: {
    name: "Matheus Pereira",
    email: "matheuszwilk@gmail.com",
    avatar: "M",
  },
  singleItem: [
    {
      name: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
  ],
  navMain: [
    {
      title: "Products Area",
      url: "#",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "Products",
          url: "/products",
        },
      ],
    },
    {
      title: "Sales Area",
      url: "#",
      icon: Bot,
      isActive: false,
      items: [
        {
          title: "Sales",
          url: "/sales",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="items mt-2 flex justify-between gap-[11px]">
        <Image
          src="https://www.lg.com/content/dam/lge/common/logo/logo-lg-100-44.svg"
          alt="LG Logo"
          width={100}
          height={40}
          className="mx-auto"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavSingleItem singleItem={data.singleItem} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <DottedSeparator />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
