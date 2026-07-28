import { Project } from './Project.tsx';
import { AddProject } from './AddProject.tsx';
import { createProject, readProjects, updateProject, deleteProject } from '../api.ts';
import { useCrud } from '../../../hooks/useCollection.ts';
import type { CreateProjectType, ProjectType } from '../types.ts';

type Props = {
    setProjectId: (id: string) => void;
    projectId: string | null;
};

export function ProjectsList(props: Props) {
    const {
        itemsList,
        isAddItemOpen,
        setIsAddItemOpen,
        handleAddItem,
        handleRemoveItem,
        handleUpdateItem,
    } = useCrud<ProjectType, string, CreateProjectType>({
        readItems: readProjects,
        createItem: createProject,
        deleteItem: deleteProject,
        updateItem: updateProject,
    });

    // async function handleEditProject(newProjectName: ProjectType) {
    //     const { error } = await editProject(newProjectName);
    //
    //     if (error !== null) {
    //         console.error(error.message);
    //         return;
    //     }
    //
    //     const renamedProject = projects.map((item) => {
    //         if (item.id === newProjectName.id) {
    //             return {
    //                 ...item,
    //                 title: newProjectName.title,
    //             };
    //         } else {
    //             return item;
    //         }
    //     });
    //     setProjects(renamedProject);
    // }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h2>Projects</h2>
                <div>
                    <button
                        onClick={() => {
                            setIsAddItemOpen(!isAddItemOpen);
                        }}
                    >
                        Add project
                    </button>
                </div>
            </div>
            {isAddItemOpen && (
                <div style={{ padding: '20px 0' }}>
                    <AddProject handleAddProject={handleAddItem} />
                </div>
            )}
            <ul>
                {itemsList.map((project) => (
                    <Project
                        key={project.id}
                        setProjectId={props.setProjectId}
                        project={project}
                        projectId={props.projectId}
                        handleRemoveProject={handleRemoveItem}
                        handleUpdateProject={handleUpdateItem}
                    />
                ))}
            </ul>
        </div>
    );
}
