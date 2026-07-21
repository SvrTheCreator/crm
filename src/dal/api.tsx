import type { TaskType } from '../feature/tasks/types.ts';
import type { SubtaskType } from '../feature/subtasks/types.ts';

export const projectsMock = [
    {
        id: '1',
        title: 'Syntra',
    },
    {
        id: '2',
        title: 'BlockNex',
    },
];

export const tasksMock: TaskType[] = [
    {
        id: '1',
        projectId: '12',
        title: 'CraftVision.studio',
        description:
            'The project requires UX/UI design, front-end development, and SEO optimization. The design' +
            ' should be intuitive, visually appealing, and responsive. SEO strategies should be applied to improve visibility and traffic.',
        assignee: 'Robert MLG',
        priority: 'High',
        dueDate: '17.03.2025',
        status: 'In progress',
    },
    {
        id: '2',
        projectId: '1',
        title: 'CryptoBet.win',
        description:
            'The project requires UX/UI design, front-end development, and SEO optimization. The design' +
            ' should be intuitive, visually appealing, and responsive. SEO strategies should be applied to improve visibility and traffic.',
        assignee: ['VALERA NOSKOPE'],
        priority: 'Medium',
        dueDate: '19.03.2025',
        status: 'Done',
    },
    {
        id: '3',
        projectId: '2',
        title: 'CryptoBet.win',
        description:
            'The project requires UX/UI design, front-end development, and SEO optimization. The design' +
            ' should be intuitive, visually appealing, and responsive. SEO strategies should be applied to improve visibility and traffic.',
        assignee: ['VALERA NOSKOPE'],
        priority: 'Medium',
        dueDate: '19.03.2025',
        status: 'Done',
    },
];

export const subtasksMock: SubtaskType[] = [
    {
        id: '1',
        taskId: '1',
        title: 'subtask',
        assignee: 'Robert MLG',
        priority: 'High',
        status: 'In progress',
    },
    {
        id: '2',
        taskId: '1',
        title: 'repair',
        assignee: 'Vasya Pupkin',
        priority: 'High',
        status: 'To Do',
    },
    {
        id: '3',
        taskId: '2',
        title: 'poe2',
        assignee: 'Andrew Pi',
        priority: 'High',
        status: 'Done',
    },
    {
        id: '4',
        taskId: '2',
        title: 'Dicebet',
        assignee: 'Grigory Engineer',
        priority: 'High',
        status: 'Done',
    },
];
