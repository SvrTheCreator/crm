import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Workspace } from './pages/workspace/Workspace.tsx';
import { Header } from './widgets/Header.tsx';
import { Footer } from './widgets/Footer.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Header />
        <main>
            <Workspace />
        </main>
        <Footer />
    </StrictMode>,
);
