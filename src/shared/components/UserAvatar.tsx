import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils.ts';

const DEFAULT_AVATAR = '/user_default_avatar.png';

type Props = {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    className?: string;
};

export function UserAvatar(props: Props) {
    const initials =
        `${props.firstName?.[0] ?? ''}${props.lastName?.[0] ?? ''}`.toUpperCase() || '?';
    const hasPhoto = Boolean(props.avatarUrl) && props.avatarUrl !== DEFAULT_AVATAR;

    return (
        <Avatar className={cn('size-6 rounded-lg', props.className)}>
            {hasPhoto && (
                <AvatarImage src={props.avatarUrl} alt={`${props.firstName} ${props.lastName}`} />
            )}
            <AvatarFallback className="rounded-lg text-[10px]">{initials}</AvatarFallback>
        </Avatar>
    );
}
