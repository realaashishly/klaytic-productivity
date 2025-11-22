"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { getTasksFromDB } from '@/actions/taskActions';

interface TasksContextType {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const dbTasks = await getTasksFromDB();
            if (dbTasks) {
                setTasks(dbTasks);
            }
        };
        fetchTasks();
    }, []);

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
