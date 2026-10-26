import { useEffect, useState } from 'react';
import { getUsers } from '../api.ts';
import type { UsersType } from '../types.ts';

export function useUsers() {
    const [users, setUsers] = useState<Array<UsersType>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data, error } = await getUsers();
            if (data) setUsers(data);
            if (error !== null) console.log(error.message);
            setLoading(false);
        }
        load();
    }, []);

    return { users, loading };
}
