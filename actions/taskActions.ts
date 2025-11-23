"use server";
import clientPromise, { connectDB } from "@/lib/db";
import { TaskModel } from "@/models/task-model";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

const getSession = async () => {
    return await auth.api.getSession({
        headers: await headers()
    });
};

export async function getTasksFromDB() {
    try {
        const session = await getSession();
        if (!session?.user) return [];

        await connectDB();
        // Sort by createdAt descending (newest first) and filter by userId
        const tasks = await TaskModel.find({ userId: session.user.id }).sort({ createdAt: -1 });

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
        const session = await getSession();
        if (!session?.user) throw new Error("Unauthorized");

        await connectDB();

        const newTask = new TaskModel({
            userId: session.user.id,
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
        const session = await getSession();
        if (!session?.user) throw new Error("Unauthorized");

        await connectDB();

        const updatedTask = await TaskModel.findOneAndUpdate(
            { _id: taskId, userId: session.user.id },
            { status: newStatus },
            { new: true }
        );

        if (!updatedTask) throw new Error("Task not found or unauthorized");

        return JSON.parse(JSON.stringify(updatedTask));
    } catch (error) {
        console.error("Update Error:", error);
    }
}


export async function updateTaskDetailsInDB(task: { id: string; title: string; description: string; dueDate?: string; tags: string[]; imageUrl?: string; }) {
    try {
        const session = await getSession();
        if (!session?.user) throw new Error("Unauthorized");

        await connectDB();

        const updatedTask = await TaskModel.findOneAndUpdate(
            { _id: task.id, userId: session.user.id },
            {
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                tags: task.tags,
                imageUrl: task.imageUrl
            },
            { new: true }
        );

        if (!updatedTask) throw new Error("Task not found or unauthorized");

        return JSON.parse(JSON.stringify(updatedTask));
    } catch (error) {
        console.error("Edit Error:", error);
    }
}


export async function deleteTaskFromDB(taskId: string) {
    try {
        const session = await getSession();
        if (!session?.user) throw new Error("Unauthorized");

        await connectDB();

        const deletedTask = await TaskModel.findOneAndDelete({ _id: taskId, userId: session.user.id });

        if (!deletedTask) throw new Error("Task not found or unauthorized");

        return { success: true, id: taskId };
    } catch (error) {
        console.error("Delete Error:", error);
        return { success: false };
    }
}