import { useEffect, useState } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';

export const useLoad = <ItemsType, IdType>(
    getItems: (
        required_ID: IdType,
    ) => Promise<{ data: ItemsType[] | null; error: PostgrestError | null }>,
    required_ID: IdType,
) => {
    const [itemsList, setItemsList] = useState<Array<ItemsType>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            if (required_ID === null) return;
            setItemsList([]);
            setError('');
            setLoading(true);
            const { data, error } = await getItems(required_ID);

            if (error !== null) {
                setError(error.message);
                setLoading(false);
                return;
            }
            if (data) {
                setItemsList(data);
                setLoading(false);
            }
        }
        load();
    }, [required_ID, getItems]);

    return { itemsList, setItemsList, loading, error };
};
