import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, PanelLeft, Laptop, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useDeviceView } from '@/context/device-view-provider';
import { cn } from '@/lib/utils';

function DeviceSwitcher() {
  const { view, setView } = useDeviceView();

  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
      <Button
        variant={view === 'desktop' ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => setView('desktop')}
        className={cn('h-8 w-8', view === 'desktop' && 'bg-background shadow-sm')}
      >
        <Laptop className="h-4 w-4" />
        <span className="sr-only">Desktop</span>
      </Button>
      <Button
        variant={view === 'mobile' ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => setView('mobile')}
        className={cn('h-8 w-8', view === 'mobile' && 'bg-background shadow-sm')}
      >
        <Smartphone className="h-4 w-4" />
        <span className="sr-only">Mobile</span>
      </Button>
    </div>
  );
}


export default function Header() {

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger>
        <PanelLeft />
      </SidebarTrigger>
      <h1 className="text-xl font-semibold md:hidden">KisanMitra</h1>
      <div className="flex-1 justify-center hidden md:flex">
        <DeviceSwitcher />
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Globe className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Select Language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem disabled>हिन्दी (Coming Soon)</DropdownMenuItem>
            <DropdownMenuItem disabled>తెలుగు (Coming Soon)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
