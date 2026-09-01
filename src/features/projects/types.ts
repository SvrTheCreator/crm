export type ProjectType = {
    id: string;
    title: string;
    owner_id: string;
};

export type CreateProjectType = {
    title: string;
};

export type ProjectMembersType = {
    project_id: string;
    user_id: string;
};
