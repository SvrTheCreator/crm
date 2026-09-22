import { Link } from 'react-router';

export function NotFound() {
    return (
        <>
            <h2>Page not found</h2>
            <Link to="/">Go Home</Link>
        </>
    );
}
