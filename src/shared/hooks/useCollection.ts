import { useEffect, useState } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';
import type { UpdateField, UpdateValue } from '@/shared/types.ts';
import { toast } from '@/components/ui/toast.tsx';

type PromiseType<ItemsType> = Promise<{ data: ItemsType | null; error: PostgrestError | null }>;

type CrudPropsType<ItemsType, IdType, CreateItemType> = {
    itemName: string;
    readItems: (required_ID: IdType) => PromiseType<ItemsType[]>;
    required_ID: IdType;
    createItem: (item: CreateItemType) => PromiseType<ItemsType>;
    deleteItem: (id: string) => Promise<{ error: PostgrestError | null }>;
    updateItem: (id: string, field: UpdateField, value: UpdateValue) => PromiseType<ItemsType>;
};

export const useCrud = <ItemsType extends { id: string }, IdType, CreateItemType>({
    itemName,
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

    async function handleCreateItem(item: CreateItemType) {
        const { data, error } = await createItem(item);

        if (error !== null) {
            toast.add({
                type: 'error',
                description: `Failed to create ${itemName.toLowerCase()}`,
            });
            return;
        }
        if (data) {
            setItemsList([data, ...itemsList]);
            setIsAddItemOpen(false);
            toast.add({
                type: 'success',
                description: `${itemName} created`,
            });
        }
    }

    async function handleRemoveItem(id: string) {
        const { error } = await deleteItem(id);
        if (error !== null) {
            toast.add({
                type: 'error',
                description: `Failed to delete ${itemName.toLowerCase()}`,
            });
            return;
        }
        setItemsList(itemsList.filter((item) => item.id !== id));
        toast.add({
            type: 'success',
            description: ` ${itemName} deleted`,
        });
    }
    async function handleUpdateItem(id: string, field: UpdateField, value: UpdateValue) {
        const { error } = await updateItem(id, field, value);
        if (error !== null) {
            toast.add({
                type: 'error',
                description: `Failed to save changes`,
            });
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
        toast.add({
            type: 'success',
            description: `Changes saved`,
        });
    }

    // одно действие пользователя — один тост, даже если полей изменилось несколько
    async function handleUpdateFields(id: string, fields: Partial<ItemsType>) {
        const changes = Object.entries(fields) as [UpdateField, UpdateValue][];
        if (changes.length === 0) return;

        const results = await Promise.all(
            changes.map(([field, value]) => updateItem(id, field, value)),
        );

        if (results.some((result) => result.error !== null)) {
            toast.add({
                type: 'error',
                description: `Failed to save changes`,
            });
            return;
        }

        setItemsList(itemsList.map((el) => (el.id === id ? { ...el, ...fields } : el)));
        toast.add({
            type: 'success',
            description: `Changes saved`,
        });
    }

    return {
        itemsList,
        setItemsList,
        loading,
        error,
        isAddItemOpen,
        setIsAddItemOpen,
        handleCreateItem,
        handleRemoveItem,
        handleUpdateItem,
        handleUpdateFields,
    };
};
