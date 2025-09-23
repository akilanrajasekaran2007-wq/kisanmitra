import { Home } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import { KrishiMitraAIIcon } from '@/components/icons';

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <KrishiMitraAIIcon className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold">KrishiMitraAI</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/" tooltip="Dashboard" isActive>
                <Home />
                <span className="group-data-[collapsible=icon]:hidden">
                  Dashboard
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 lg:p-6"></main>
      </SidebarInset>
    </SidebarProvider>
  );
}
