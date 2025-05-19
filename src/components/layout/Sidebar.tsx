import React from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  MessageSquare,
  Headphones
} from "lucide-react";

import { MainNavItem } from "@/types";
import { siteConfig } from "@/config/site";

interface SidebarProps {
  items?: MainNavItem[]
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <div className="flex flex-col space-y-6 w-full">
      <a href="/" className="flex items-center space-x-2">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-8 w-8 rounded-md"
        />
        <span className="font-bold">{siteConfig.name}</span>
      </a>
      <div className="flex flex-col space-y-1">
        {items?.map((item) => (
          item.href ? (
            <a
              key={item.title}
              href={item.href}
              className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-secondary"
            >
              {item.icon}
              <span>{item.title}</span>
            </a>
          ) : null
        ))}
      </div>
    </div>
  )
}

export const defaultItems: MainNavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Usuários",
    href: "/usuarios",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "WhatsApp",
    href: "/whatsapp",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: "Áudios Rodrigo",
    href: "/rodrigo-audio",
    icon: <Headphones className="h-5 w-5" />
  },
]
