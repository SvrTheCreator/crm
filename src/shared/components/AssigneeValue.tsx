import { UserRound } from 'lucide-react';
import { UserAvatar } from './UserAvatar.tsx';
import type { UsersType } from '@/features/users/types.ts';

type Props = {
    user?: UsersType;
};

export function AssigneeValue({ user }: Props) {
    if (!user) {
        return (
            <span className="flex items-center gap-2 text-muted-foreground">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-dashed">
                    <UserRound className="size-3" />
                </span>
                Unassigned
            </span>
        );
    }

    return (
        <span className="flex items-center gap-2 truncate">
            <UserAvatar
                firstName={user.first_name}
                lastName={user.last_name}
                avatarUrl={user.user_avatar}
            />
            {`${user.first_name} ${user.last_name}`}
        </span>
    );
}
