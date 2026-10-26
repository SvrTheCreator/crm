import { toast } from '@/components/ui/toast.tsx';

export async function copyCurrentUrl() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        toast.add({ type: 'success', description: 'Link copied' });
    } catch {
        toast.add({ type: 'error', description: 'Failed to copy link' });
    }
}
