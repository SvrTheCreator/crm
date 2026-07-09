import { useForm } from 'react-hook-form';
import type { CreateProjectType } from '../types.ts';

type Props = {
    handleAddProject: (project: CreateProjectType) => void;
};

export function AddProject(props: Props) {
    const { register, handleSubmit, reset } = useForm<CreateProjectType>();

    const addNewProject = (project: CreateProjectType) => {
        const newProject = {
            title: project.title,
        };
        props.handleAddProject(newProject);
        reset();
    };

    return (
        <form
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            onSubmit={handleSubmit(addNewProject)}
        >
            <label htmlFor="project">New Project</label>
            <input id="project" type="text" {...register('title')} />
            <button type="submit">add</button>
        </form>
    );
}
