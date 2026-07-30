import { useEffect, useState } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';
import type { UpdateField, UpdateValue } from '../../features/tasks/types.ts';

type PromiseType<ItemsType> = Promise<{ data: ItemsType | null; error: PostgrestError | null }>;

type CrudPropsType<ItemsType, IdType, CreateItemType> = {
    readItems: (required_ID: IdType) => PromiseType<ItemsType[]>;
    required_ID: IdType;
    createItem: (item: CreateItemType) => PromiseType<ItemsType>;
    deleteItem: (id: string) => Promise<{ error: PostgrestError | null }>;
    updateItem: (id: string, field: UpdateField, value: UpdateValue) => PromiseType<ItemsType>;
};

export const useCrud = <ItemsType extends { id: string }, IdType, CreateItemType>({
    required_ID,
    readItems,
    createItem,
    deleteItem,
    updateItem,
}: CrudPropsType<ItemsType, IdType, CreateItemType>) => {
    const [itemsList, setItemsList] = useState<Array<ItemsType>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState('');
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);

    useEffect(() => {
        async function load() {
            if (required_ID === null) return;
            setItemsList([]);
            setError('');
            setLoading(true);
            const { data, error } = await readItems(required_ID);

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
    }, [required_ID, readItems]);

    async function handleAddItem(item: CreateItemType) {
        const { data, error } = await createItem(item);

        if (error !== null) {
            console.log(error.message);
            return;
        }
        if (data) {
            setItemsList([data, ...itemsList]);
            setIsAddItemOpen(false);
        }
    }

    async function handleRemoveItem(id: string) {
        const { error } = await deleteItem(id);
        if (error !== null) {
            console.log(error.message);
            return;
        }
        setItemsList(itemsList.filter((item) => item.id !== id));
    }
    async function handleUpdateItem(id: string, field: UpdateField, value: UpdateValue) {
        const { error } = await updateItem(id, field, value);
        if (error !== null) {
            console.log(error.message);
            return;
        }
        const updatedItem = itemsList.map((el) => {
            if (el.id === id) {
                return {
                    ...el,
                    [field]: value,
                };
            } else return el;
        });
        setItemsList(updatedItem);
    }

    return {
        itemsList,
        setItemsList,
        loading,
        error,
        isAddItemOpen,
        setIsAddItemOpen,
        handleAddItem,
        handleRemoveItem,
        handleUpdateItem,
    };
};
