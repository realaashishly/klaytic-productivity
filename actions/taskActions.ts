"use server";
import connectDB from "@/lib/mongoose";
import { TaskModel } from "@/models/task-model";

export async function getTasksFromDB() {
    try {
        await connectDB();
        // Sort by createdAt descending (newest first)
        const tasks = await TaskModel.find({}).sort({ createdAt: -1 });
        
        return tasks.map((task: any) => ({
            ...task.toObject(),
            id: task._id.toString(),
            _id: task._id.toString(),
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined
        }));
    } catch (error) {
        console.error("Fetch Error:", error);
        return [];
    }
}

export async function createTaskInDB(taskData: { title: any; description: any; dueDate: any; tags: any; }) {
    try {
        await connectDB();

        const newTask = new TaskModel({
            title: taskData.title,
            description: taskData.description,
            dueDate: taskData.dueDate,
            tags: taskData.tags,
            status: 'TODO',
            priority: 0,
            aiGenerated: false
        });

        const savedTask = await newTask.save();

        return JSON.parse(JSON.stringify(savedTask));
    } catch (error) {
        console.error("Database Error:", error);
        throw error;
    }
}


export async function updateTaskStatusInDB(taskId: string, newStatus: string) {
    try {
        await connectDB();

        const updatedTask = await TaskModel.findByIdAndUpdate(
            taskId,
            { status: newStatus },
            { new: true }
        );

        return JSON.parse(JSON.stringify(updatedTask));
    } catch (error) {
        console.error("Update Error:", error);
    }
}


export async function updateTaskDetailsInDB(task: { id: string; title: string; description: string; dueDate?: string; tags: string[]; imageUrl?: string; }) {
    try {
        await connectDB();

        const updatedTask = await TaskModel.findByIdAndUpdate(
            task.id,
            {
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                tags: task.tags,
                imageUrl: task.imageUrl
            },
            { new: true }
        );

        return JSON.parse(JSON.stringify(updatedTask));
    } catch (error) {
        console.error("Edit Error:", error);
    }
}


export async function deleteTaskFromDB(taskId: string) {
    try {
        await connectDB();

        await TaskModel.findByIdAndDelete(taskId);

        return { success: true, id: taskId };
    } catch (error) {
        console.error("Delete Error:", error);
        return { success: false };
    }
}