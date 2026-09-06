import { useEffect, useState } from 'react';
import { getProjectUser } from '../api.ts';
import type { UsersType } from '../../users/types.ts';

type Props = {
    projectId: string | null;
    users: UsersType[];
};

export function useProjectUsers(props: Props) {
    const [projectUsers, setProjectUsers] = useState<UsersType[]>([]);
    const { projectId, users } = props;
    const otherUsers = users.filter((user) => !projectUsers.some((m) => m.id === user.id));
    useEffect(() => {
        async function load() {
            if (projectId === null) return;
            const { data, error } = await getProjectUser(projectId);
            if (error !== null) {
                alert(error.message);
                return;
            }
            if (data && users) {
                const members = data.map((item) => item.user_id);
                const filteredMembers = users.filter((user) => {
                    return members.includes(user.id);
                });

                setProjectUsers(filteredMembers);
            }
        }
        load();
    }, [projectId, users]);
    return { projectUsers, otherUsers };
}
