interface User {
    id: string;
    name: string;
    email: string;
}

export const getUser = (): User => {
    return {
        id: '1',
        name: 'Arun',
        email: 'arun@example.com',
    };
};
