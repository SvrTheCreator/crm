import {ProjectsList} from "../projects/components/ProjectsList.tsx";

type Props = {
    setProjectId: (id: string) => void
}

export function Sidebar(props: Props) {

    return (
        <aside>
            <ProjectsList setProjectId={props.setProjectId}/>
        </aside>
    )
}