'use client';
import { Home, ClipboardPen, Bug, Landmark, LogOut, History as HistoryIcon } from 'lucide-react';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import { KisanMitraIcon } from '@/components/icons';
import { useDeviceView } from '@/context/device-view-provider';
import { cn } from '@/lib/utils';
import YourPlantForm from '@/components/your-plant-form';
import WeatherForecast from '@/components/weather-forecast';

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
                    <KisanMitraIcon className="h-8 w-8 text-primary" />
                    <h1 className="text-xl font-semibold">KisanMitra</h1>
                </div>
                </SidebarHeader>
                <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                    <Link href="/">
                      <SidebarMenuButton tooltip="Dashboard" isActive>
                          <Home />
                          <span className="group-data-[collapsible=icon]:hidden">
                          Dashboard
                          </span>
                      </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href="/soil-analysis">
                        <SidebarMenuButton tooltip="Soil Analysis">
                          <ClipboardPen />
                          <span className="group-data-[collapsible=icon]:hidden">
                            Soil Analysis
                          </span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href="/identify-pest">
                        <SidebarMenuButton tooltip="Identify Pest">
                          <Bug />
                          <span className="group-data-[collapsible=icon]:hidden">
                            Identify Pest
                          </span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Link href="/history">
                        <SidebarMenuButton tooltip="History">
                            <HistoryIcon />
                            <span className="group-data-[collapsible=icon]:hidden">
                            History
                            </span>
                        </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href="/govt-schemes">
                        <SidebarMenuButton tooltip="Govt. Schemes">
                          <Landmark />
                          <span className="group-data-[collapsible=icon]:hidden">
                            Govt. Schemes
                          </span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Logout">
                        <LogOut />
                        <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <Header />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                  <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                    <YourPlantForm />
                  </div>
                  <div className="grid auto-rows-max items-start gap-4 md:gap-8">
                    <WeatherForecast />
                  </div>
                </main>
            </SidebarInset>
            </SidebarProvider>
        </div>
    </div>
  );
}
