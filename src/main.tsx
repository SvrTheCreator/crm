import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {Sidebar} from "./components/Sidebar.tsx";
import {ProjectsTable} from "./components/ProjectsTable.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/*<Header/>*/}
        <Sidebar/>
        <ProjectsTable/>
    </StrictMode>,
)
