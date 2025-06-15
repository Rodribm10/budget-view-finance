
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Settings } from "lucide-react";
import { useLocation, NavLink } from "react-router-dom";

export default function SettingsSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Configurações
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/configuracoes"}>
                  <NavLink to="/configuracoes">
                    <Settings className="mr-2" />
                    <span>Geral</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Adicione outros itens de configuração aqui futuramente */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
