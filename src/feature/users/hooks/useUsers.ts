import { useEffect, useState } from 'react';
import type { UsersType } from '../../tasks/types.ts';
import { supabase } from '../../../utils/supabase.ts';

export function useUsers() {
    const [users, setUsers] = useState<Array<UsersType>>([]);

    useEffect(() => {
        async function getProfiles() {
            const response = await supabase.from('profiles').select();

            if (response.error) {
                console.log(response.error);
                return;
            }
            if (response.data) {
                setUsers(response.data);

                // console.log(response.data);
            }
        }
        getProfiles();
    }, []);

    return { users };
}
