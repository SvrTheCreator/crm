import type { UsersType } from '../../users/types.ts';
import { Dialog, DialogContent } from '@/components/ui/dialog.tsx';
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

type Props = {
    users: UsersType[];
    openPanel: OpenPanelType;
    onSelect: (event: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

export function ProjectMembers(props: Props) {
    const items = props.users.map((user) => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
    }));

    return (
        <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
            {props.isOpen && props.users.length > 0 && (
                <DialogContent>
                    {props.openPanel?.kind === 'remove' ? (
                        <h2>Remove user</h2>
                    ) : (
                        <h2>Add new user</h2>
                    )}

                    <Select items={items}>
                        <SelectTrigger className="w-full max-w-90">
                            <SelectValue />
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

                    {/*<select onChange={(event) => props.onSelect(event.target.value)}>*/}
                    {/*    <option value="">Выберите пользователя</option>*/}
                    {/*{props.users.map((user: UsersType) => {*/}
                    {/*    const fullName = `${user.first_name} ${user.last_name}`;*/}
                    {/*    return (*/}
                    {/*        <option key={user.id} value={user.id}>*/}
                    {/*            {fullName}*/}
                    {/*        </option>*/}
                    {/*    );*/}
                    {/*})}*/}
                    {/*</select>*/}
                </DialogContent>
            )}
            {props.isOpen && props.users.length === 0 && <div>Нечего делать</div>}
        </Dialog>
        // <div>
        //     {props.isOpen && props.users.length > 0 && (
        //         <div>
        //             <select onChange={(event) => props.onSelect(event.target.value)}>
        //                 <option value="">Выберите пользователя</option>
        //                 {props.users.map((user: UsersType) => {
        //                     const fullName = `${user.first_name} ${user.last_name}`;
        //                     return (
        //                         <option key={user.id} value={user.id}>
        //                             {fullName}
        //                         </option>
        //                     );
        //                 })}
        //             </select>
        //         </div>
        //     )}
        //     {props.isOpen && props.users.length === 0 && <div>Нечего делать</div>}
        // </div>
    );
}
