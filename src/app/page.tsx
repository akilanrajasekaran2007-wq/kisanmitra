import { Home, Leaf, Sprout } from 'lucide-react';

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
import ImageAnalysisForm from '@/components/image-analysis-form';
import WeatherForecast from '@/components/weather-forecast';
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
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="My Crops">
                <Sprout />
                <span className="group-data-[collapsible=icon]:hidden">
                  My Crops
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Pest Library">
                <Leaf />
                <span className="group-data-[collapsible=icon]:hidden">
                  Pest Library
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="p-4 lg:p-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <ImageAnalysisForm />
            </div>
            <div className="xl:col-span-1">
              <WeatherForecast />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
