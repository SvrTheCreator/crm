export type CreateUserType = {
    email: string;
    password: string;
    confirm_password: string;
    first_name: string;
    last_name: string;
    user_avatar: string;
};

export type UserType = {
    email: string;
    password: string;
};
