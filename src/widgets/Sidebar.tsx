import { ProjectsList } from '../features/projects/components/ProjectsList.tsx';
import type { UsersType } from '../features/users/types.ts';

type Props = {
    otherUsers: UsersType[];
    projectUsers: UsersType[];
    addMember: (userId: string) => Promise<void>;
    removeMember: (userId: string) => Promise<void>;
};

export function Sidebar(props: Props) {
    return (
        <aside style={{ padding: '24px', borderRight: '1px solid gray', minHeight: '100vh' }}>
            <h2>Ganeral</h2>
            <ul>
                <li>
                    <a href="">My tasks</a>
                </li>
                <li>
                    <a href="">Favorites</a>
                </li>
                <li>
                    <a href="">Dmessages</a>
                </li>
                <li>
                    <a href="">Trash</a>
                </li>
            </ul>

            <ProjectsList
                otherUsers={props.otherUsers}
                projectUsers={props.projectUsers}
                addMember={props.addMember}
                removeMember={props.removeMember}
            />
        </aside>
    );
}
