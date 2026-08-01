const style = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '16px',
} as const;

export function LoginForm() {
    return (
        <div style={style}>
            <h2>Login form</h2>
            <form>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input id="email" type="email" />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input id="password" type="password" />
                </div>
            </form>
        </div>
    );
}
