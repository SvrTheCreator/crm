import { useForm } from 'react-hook-form';
import type { CreateProjectType } from '../types.ts';
import { Button } from '@/components/ui/button.tsx';
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input.tsx';

type Props = {
    handleCreateProject: (project: CreateProjectType) => void;
};

export function AddProject(props: Props) {
    const { register, handleSubmit, reset } = useForm<CreateProjectType>();

    const addNewProject = (project: CreateProjectType) => {
        const newProject = {
            title: project.title,
        };
        props.handleCreateProject(newProject);
        reset();
    };

    return (
        <DialogContent className="sm:max-w-sm">
            <form onSubmit={handleSubmit(addNewProject)}>
                <DialogHeader>
                    <DialogTitle>Add new project</DialogTitle>
                    <DialogDescription className="pb-2">
                        Enter the name of the new project here. Click "Add" when you are finished.
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup className="pb-2">
                    <Field>
                        <Input
                            id="project"
                            type="text"
                            {...register('title')}
                            placeholder="New project"
                        />
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose render={<Button variant="outline">Cancel</Button>} />
                    <Button type="submit">Add</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
