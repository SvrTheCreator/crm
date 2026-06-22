export type dashboardProject = {
    id: number,
    projectName: string,
    description: string,
    assignee: string[],
    priority: string,
    dueDate: string,
    status: 'To Do' | 'Done' | 'In progress',
}

export const projectsSyntra: dashboardProject[] = [
    {
        id: 1,
        projectName: "CraftVision.studio",
        description: 'The project requires UX/UI design, front-end development, and SEO optimization. The design' +
            ' should be intuitive, visually appealing, and responsive. SEO strategies should be applied to improve visibility and traffic.',
        assignee: ['Robert MLG', 'VALERA NOSKOPE'],
        priority: 'High',
        dueDate: '17.03.2025',
        status: 'In progress',
    },
    {
        id: 2,
        projectName: "CryptoBet.win",
        description: 'The project requires UX/UI design, front-end development, and SEO optimization. The design' +
            ' should be intuitive, visually appealing, and responsive. SEO strategies should be applied to improve visibility and traffic.',
        assignee: ['VALERA NOSKOPE'],
        priority: 'medium',
        dueDate: '19.03.2025',
        status: 'Done',
    },
]

// export const getDashboardProject = (ProjectsSyntra: dashboardProject[]) => {
//     const promise = ProjectsSyntra
//     return promise
// }
