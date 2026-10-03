import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useState } from 'react';
import type { UpdateField, UpdateValue } from '@/features/tasks/types.ts';
import type { OpenPanelType } from '@/features/projects/components/Project.tsx';
import type { ProjectType } from '@/features/projects/types.ts';

type Props = {
    project: ProjectType;
    handleUpdateProject: (id: string, field: UpdateField, value: UpdateValue) => void;
    setOpenPanel: (openPanel: OpenPanelType) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

export function RenameProject(props: Props) {
    const [newProjectName, setNewProjectName] = useState(props.project.title);

    const handleFieldChange = () => {
        props.handleUpdateProject(props.project.id, 'title', newProjectName);
        props.setOpenPanel(null);
    };
    return (
        <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Изменить имя</DialogTitle>
                    <DialogDescription>
                        Введите новое имя для вашего профиля. Нажмите сохранить, когда закончите.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="name" className="text-right" />
                        <Input
                            id="name"
                            value={newProjectName}
                            onChange={(event) => {
                                setNewProjectName(event.target.value);
                            }}
                            type="text"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            setNewProjectName(props.project.title);
                            props.setOpenPanel(null);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button onClick={() => handleFieldChange()}>Rename</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
