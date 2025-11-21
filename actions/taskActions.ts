import { clientPromise } from "@/lib/db";
import { TaskModel } from "@/models/task-model";

export async function createTaskInDB(taskData: { title: any; description: any; dueDate: any; tags: any; }) {
    try {
        await clientPromise;

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
    }
}


export async function updateTaskStatusInDB(taskId: string, newStatus: string) {
    try {
        await clientPromise;

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


export async function updateTaskDetailsInDB(task: { id: string; title: string; description: string; dueDate: string; tags: string; }) {
    try {
        await clientPromise;

        const updatedTask = await TaskModel.findByIdAndUpdate(
            task.id,
            {
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                tags: task.tags
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
        await clientPromise;

        await TaskModel.findByIdAndDelete(taskId);

        return { success: true, id: taskId };
    } catch (error) {
        console.error("Delete Error:", error);
        return { success: false };
    }
}