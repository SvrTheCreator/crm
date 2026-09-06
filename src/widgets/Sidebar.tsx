import { ProjectsList } from '../features/projects/components/ProjectsList.tsx';
import type { UsersType } from '../features/users/types.ts';

type Props = {
    setProjectId: (id: string) => void;
    projectId: string | null;
    otherUsers: UsersType[];
};

export function Sidebar(props: Props) {
    return (
        <aside style={{ padding: '24px', borderRight: '1px solid gray', minHeight: '100vh' }}>
            <ProjectsList
                projectId={props.projectId}
                setProjectId={props.setProjectId}
                otherUsers={props.otherUsers}
            />
        </aside>
    );
}
