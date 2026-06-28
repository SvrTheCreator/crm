import {ProjectsList} from "../projects/components/ProjectsList.tsx";

type Props = {
    setProjectId: (id: string) => void
    projectId: string | null;
}

export function Sidebar(props: Props) {

    return (
        <aside style={{padding: '24px', borderRight: '1px solid gray', minHeight: '100vh'}}>
            <ProjectsList projectId={props.projectId} setProjectId={props.setProjectId}/>
        </aside>
    )
}