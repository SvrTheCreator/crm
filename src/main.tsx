import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {Sidebar} from "./feature/layers/Sidebar.tsx";
import {TaskList} from "./feature/tasks/components/TaskList.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/*<Header/>*/}
        <Sidebar/>
        <TaskList/>
    </StrictMode>,
)
