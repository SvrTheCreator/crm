import type {Task} from "../feature/tasks/types.ts";

export const projectsMock = [
    {
        id: "1",
        title: "Syntra"
    },
    {
        id: "2",
        title: "BlockNex"
    },
]

export const tasksMock: Task[] = [
    {
        id: '1',
        projectId: '1',
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
        projectId: '1',
        title: "CryptoBet.win",
        description: 'The project requires UX/UI design, front-end development, and SEO optimization. The design' +
            ' should be intuitive, visually appealing, and responsive. SEO strategies should be applied to improve visibility and traffic.',
        assignee: ['VALERA NOSKOPE'],
        priority: 'Medium',
        dueDate: '19.03.2025',
        status: 'Done',
    }, {
        id: '3',
        projectId: '2',
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
