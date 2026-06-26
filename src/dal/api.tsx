import type {Task} from "../feature/tasks/types.ts";

export const projectsMock = [
    {
        id: "syntra",
        title: "Syntra"
    },
]

export const tasksMock: Task[] = [
    {
        id: '1',
        projectId: 'syntra',
        title: "CraftVision.studio",
        description: 'The project requires UX/UI design, front-end development, and SEO optimization. The design' +
            ' should be intuitive, visually appealing, and responsive. SEO strategies should be applied to improve visibility and traffic.',
        assignee: ['Robert MLG', 'VALERA NOSKOPE'],
        priority: 'High',
        dueDate: '17.03.2025',
        status: 'In progress',
    },
    {
        id: '2',
        projectId: 'syntra',
        title: "CryptoBet.win",
        description: 'The project requires UX/UI design, front-end development, and SEO optimization. The design' +
            ' should be intuitive, visually appealing, and responsive. SEO strategies should be applied to improve visibility and traffic.',
        assignee: ['VALERA NOSKOPE'],
        priority: 'Medium',
        dueDate: '19.03.2025',
        status: 'Done',
    },
]

// export const getDashboardProject = (ProjectsSyntra: dashboardProject[]) => {
//     const promise = ProjectsSyntra
//     return promise
// }
