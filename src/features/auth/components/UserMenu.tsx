import { signOut } from '../api.ts';
import type { User } from '@supabase/supabase-js';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { UserAvatar } from '@/shared/components/UserAvatar.tsx';
import { EllipsisVertical, LogOut, Moon, Settings, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme.ts';
import { Separator } from '@/components/ui/separator.tsx';

type Props = {
    currentUser: User;
};

export function UserMenu({ currentUser }: Props) {
    const metadata = currentUser.user_metadata;
    const fullName = `${metadata.first_name} ${metadata.last_name}`;

    const { setTheme } = useTheme();

    return (
        <SidebarMenuItem>
            <Separator />
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <SidebarMenuButton
                            className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                            size="lg"
                        />
                    }
                >
                    <UserAvatar
                        firstName={metadata.first_name}
                        lastName={metadata.last_name}
                        avatarUrl={metadata.user_avatar}
                        className="size-8"
                    />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{fullName}</span>
                        <span className="truncate text-xs">{metadata.email}</span>
                    </div>
                    <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" sideOffset={8}>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme('light')}>
                                <Sun />
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('dark')}>
                                <Moon />
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('system')}>
                                <Settings />
                                System
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                        <LogOut />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
}
