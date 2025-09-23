'use client';
import { Home, PanelLeft } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import { KrishiMitraAIIcon } from '@/components/icons';
import { useDeviceView } from '@/context/device-view-provider';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    const { view } = useDeviceView();

  return (
    <div
      className={cn(
        'min-h-screen w-full bg-muted/40 flex justify-center',
         view === 'desktop' && 'p-4'
      )}
    >
        <div
            className={cn(
            'flex flex-col-reverse w-full transition-all duration-300',
            view === 'desktop' ? 'max-w-screen-2xl' : 'max-w-sm'
            )}
        >
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
        </div>
    </div>
  );
}
