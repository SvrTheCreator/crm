import { useEffect, useState } from 'react';
import { addMembership, getProjectUser, removeMembership } from '../api.ts';
import type { UsersType } from '../../users/types.ts';

type Props = {
    projectId: string | null;
    users: UsersType[];
};

export function useProjectUsers(props: Props) {
    const [projectUsers, setProjectUsers] = useState<UsersType[]>([]);
    const { projectId, users } = props;
    const otherUsers = users.filter((user) => !projectUsers.some((m) => m.id === user.id));

    const addMember = async (userId: string) => {
        if (projectId === null) return;
        const { error } = await addMembership(userId, projectId);
        if (error !== null) {
            alert(error.message);
            return;
        }
        await load();
    };
    const removeMember = async (userId: string) => {
        if (projectId === null) return;
        const { error } = await removeMembership(userId, projectId);
        if (error !== null) {
            alert(error.message);
            return;
        }
        await load();
    };
    //  обернуть load в useCallback и вернуть его в зависимости
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

    useEffect(() => {
        load();
    }, [projectId, users]);
    return { projectUsers, otherUsers, addMember, removeMember };
}
