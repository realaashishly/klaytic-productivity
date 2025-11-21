"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task, TaskStatus } from '../types';

interface TasksContextType {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: '1',
            title: 'Analyze System Architecture',
            description: 'Deploy Gemini 3 Pro to evaluate the current monolith vs microservices trade-offs.',
            status: TaskStatus.IN_PROGRESS,
            tags: ['architecture', 'core'],
            dueDate: '2025-11-15T14:00',
            priority: 2,
            aiGenerated: false
        },
        {
            id: '2',
            title: 'Design UI System',
            description: 'Create a monochromatic component library using Nano Banana for concept art generation.',
            status: TaskStatus.TODO,
            tags: ['design', 'ui'],
            dueDate: '2025-11-20T09:00',
            priority: 1,
            aiGenerated: false
        }
    ]);

    return (
        <TasksContext.Provider value={{ tasks, setTasks }}>
            {children}
        </TasksContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TasksContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
};
