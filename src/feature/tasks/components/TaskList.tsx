import {projectsMock, tasksMock} from "../../../dal/api.tsx";
import type {SortField, Task, UpdateTaskField, UpdateTaskValue} from "../types.ts";
import {useState} from "react";
import {AddTask} from "./AddTask.tsx";
import {TaskTableBody} from "./TaskTableBody.tsx";

interface SortConfig {
    field: keyof Task | null;
    order: boolean | null;
}

export function TaskList() {
    const [taskList, setTaskList] = useState<Array<Task>>(tasksMock)
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        field: null,
        order: null
    })
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)

    const currentProject = projectsMock[0]
    const currentProjectId = currentProject.id


    const handleAddTask = (project: Task) => {
        setTaskList([...taskList, project])
    }

    const handleRemoveTask = (id: string) => {
        const projectsWithoutDeleted = taskList.filter(el => {
            return el.id !== id
        })
        setTaskList(projectsWithoutDeleted)
    }

    const handleConfig = (arg: SortField) => {
        setSortConfig(prev => ({
                ...prev,
                field: arg,
                order: !prev.order
            })
        )
    }

    const currentProjectTasks = taskList.filter(task => {
        return task.projectId === currentProjectId
    })

    const sortedTaskList = [...currentProjectTasks].sort((a, b) => {
        if (!sortConfig.field) return 0

        const aValue = a[sortConfig.field]
        const bValue = b[sortConfig.field]

        return sortConfig.order
            ? aValue.toString().localeCompare(bValue.toString(), undefined, {
                numeric: true,
                sensitivity: "base"
            })
            : bValue.toString().localeCompare(aValue.toString(), undefined, {
                numeric: true,
                sensitivity: "base"
            })
    })

    const handleUpdateTask = (id: string, field: UpdateTaskField, value: UpdateTaskValue) => {
        const projectEditStatus = taskList.map(el => {
            if (el.id === id) {
                return {
                    ...el,
                    [field]: value
                }
            } else return el
        })
        setTaskList(projectEditStatus)
        console.log(id, field, value)
        console.log(taskList)
    }

    return (
        <div>
            <button onClick={() => setIsAddProjectOpen(!isAddProjectOpen)}>Add project</button>
            {isAddProjectOpen && <AddTask currentProjectId={currentProjectId} handleAddTask={handleAddTask}/>}
            {taskList && <table>
                <thead>
                <tr>
                    <th></th>
                    <th onClick={() => {
                        handleConfig('title')
                    }
                    }>Project Name
                    </th>
                    <th>Description</th>
                    <th>Assignee</th>
                    <th onClick={() => handleConfig('priority')}>Priority</th>
                    <th>Due Date</th>
                    <th onClick={() => handleConfig('status')}>Status</th>
                </tr>
                </thead>
                <TaskTableBody
                    handleUpdateTask={handleUpdateTask}
                    sortedProjects={sortedTaskList}
                    handleRemoveTask={handleRemoveTask}/>
            </table>}
        </div>
    )
}

