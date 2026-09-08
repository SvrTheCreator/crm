import type { UsersType } from '../../users/types.ts';

type Props = {
    users: UsersType[];
    onSelect: (event: string) => void;
    isOpen: boolean;
};

export function ProjectMembers(props: Props) {
    return (
        <div>
            {props.isOpen && props.users.length > 0 && (
                <div>
                    <select onChange={(event) => props.onSelect(event.target.value)}>
                        <option value="">Выберите пользователя</option>
                        {props.users.map((user: UsersType) => {
                            const fullName = `${user.first_name} ${user.last_name}`;
                            return (
                                <option key={user.id} value={user.id}>
                                    {fullName}
                                </option>
                            );
                        })}
                    </select>
                </div>
            )}
            {props.isOpen && props.users.length === 0 && <div>Нечего делать</div>}
        </div>
    );
}
