import type { UsersType } from '../../users/types.ts';
import { Dialog, DialogClose, DialogContent, DialogFooter } from '@/components/ui/dialog.tsx';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.tsx';
import type { OpenPanelType } from '@/features/projects/components/Project.tsx';
import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { toast } from '@/components/ui/toast.tsx';
import type { PostgrestError } from '@supabase/supabase-js';

type Props = {
    users: UsersType[];
    openPanel: OpenPanelType;
    onSelect: (userId: string) => Promise<PostgrestError | null | undefined>;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

export function ProjectMembers(props: Props) {
    const [userId, setUserId] = useState<string>('');
    const items = props.users.map((user) => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
    }));

    const handleOnSelect = async (userId: string) => {
        const error = await props.onSelect(userId);

        if (error === undefined) {
            toast.add({ type: 'error', description: 'Project dont select' });
            return;
        }

        if (error !== null) {
            toast.add({ type: 'error', description: error.message });
            return;
        }

        toast.add({
            type: 'success',
            description: props.openPanel?.kind === 'remove' ? 'User removed' : 'User added',
        });
    };

    return (
        <div>
            <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
                {props.isOpen && props.users.length > 0 && (
                    <DialogContent>
                        {props.openPanel?.kind === 'remove' ? (
                            <h2>Remove user</h2>
                        ) : (
                            <h2>Add new user</h2>
                        )}

                        <Select
                            items={items}
                            onValueChange={(value) => {
                                setUserId(value as string);
                            }}
                        >
                            <SelectTrigger className="w-full max-w-90">
                                <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Users</SelectLabel>
                                    {props.users.map((user: UsersType) => {
                                        const fullName = `${user.first_name} ${user.last_name}`;
                                        return (
                                            <SelectItem key={user.id} value={user.id}>
                                                {fullName}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <DialogFooter className="sm:justify-end">
                            <DialogClose
                                render={
                                    <Button onClick={() => handleOnSelect(userId)} type="button">
                                        {props.openPanel?.kind === 'remove' ? 'Remove' : 'Add'}
                                    </Button>
                                }
                            />
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}
