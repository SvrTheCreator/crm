import { signOut } from '../api.ts';
import type { User } from '@supabase/supabase-js';

type Props = {
    currentUser: User;
};

export function UserMenu({ currentUser }: Props) {
    const metadata = currentUser.user_metadata;
    const fullName = `${metadata.first_name} ${metadata.last_name}`;
    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <img style={{ maxWidth: '20px' }} src={metadata.user_avatar} alt="" />
                </div>
                <div>{fullName}</div>
            </div>
            <div>
                <button
                    onClick={() => {
                        signOut();
                    }}
                >
                    Выйти
                </button>
            </div>
        </div>
    );
}
