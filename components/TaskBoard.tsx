"use client";

import React, { useState, useCallback } from "react";
import { Task, TaskStatus } from "../types";
import TaskCard from "./TaskCard";
import PlanGenerator from "./PlanGenerator";
import { Plus, X, Cpu } from "lucide-react";
import { useTasks } from "../context/TasksContext";
import {
  createTaskInDB,
  deleteTaskFromDB,
  updateTaskDetailsInDB,
  updateTaskStatusInDB,
} from "@/actions/taskActions";

const EMPTY_NEW_TASK = {
  title: "",
  description: "",
  dueDate: "",
  dueTime: "",
  tags: "",
};

const TaskBoard: React.FC = () => {
  const { tasks, setTasks } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState(EMPTY_NEW_TASK);
  const [loadingTask, setLoadingTask] = useState(false);
  const [dragOverColumnId, setDragOverColumnId] =
    useState<TaskStatus | null>(null);

  // -------------------------------------------------------
  // CREATE TASKS (AI plan generator)
  // -------------------------------------------------------
  const addTasks = useCallback(
    async (generated: Task[]) => {
      const saved: Task[] = [];

      for (const t of generated) {
        try {
          const stored = await createTaskInDB({
            title: t.title,
            description: t.description,
            dueDate: t.dueDate,
            tags: t.tags,
          });

          saved.push(stored);
        } catch (err) {
          console.error("Failed to save generated task:", t.title, err);
        }
      }

      if (saved.length > 0) {
        setTasks((prev) => [...saved, ...prev]);
        window.dispatchEvent(new CustomEvent("nexus-task-added"));
      }
    },
    [setTasks]
  );

  // -------------------------------------------------------
  // DELETE TASK
  // -------------------------------------------------------
  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("Delete this task permanently?")) return;

      const backup = [...tasks];
      setTasks((prev) => prev.filter((t) => t.id !== id));

      console.log('delete id: ', id);


      try {
        const result = await deleteTaskFromDB(id);
        if (!result?.success) throw new Error("Backend deletion failed");
      } catch (err) {
        console.error(err);
        setTasks(backup);
        alert("Deletion failed. Data restored.");
      }
    },
    [tasks, setTasks]
  );

  // -------------------------------------------------------
  // UPDATE TASK DETAILS
  // -------------------------------------------------------
  const handleUpdate = useCallback(
    async (updated: Task) => {
      const sanitizedTags = Array.isArray(updated.tags)
        ? updated.tags
        : String(updated.tags)
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);

      const patchedTask = { ...updated, tags: sanitizedTags };

      try {
        setTasks((prev) =>
          prev.map((t) => (t.id === patchedTask.id ? patchedTask : t))
        );

        await updateTaskDetailsInDB({
          id: patchedTask.id,
          title: patchedTask.title,
          description: patchedTask.description,
          dueDate: patchedTask.dueDate,
          tags: sanitizedTags,
          imageUrl: patchedTask.imageUrl,
        });
      } catch (err) {
        console.error("Update failed:", err);
      }
    },
    [setTasks]
  );

  // -------------------------------------------------------
  // MANUAL TASK CREATE (modal)
  // -------------------------------------------------------
  const handleManualSubmit = useCallback(
    async (e?: React.MouseEvent) => {
      e?.preventDefault();
      if (!newTask.title) return;

      setLoadingTask(true);

      const iso =
        newTask.dueDate && newTask.dueTime
          ? `${newTask.dueDate}T${newTask.dueTime}`
          : newTask.dueDate || "";

      const parsedTags = newTask.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

     


      try {
        const stored = await createTaskInDB({
          title: newTask.title,
          description: newTask.description,
          dueDate: iso,
          tags: parsedTags,
        });

        setTasks((prev) => [stored, ...prev]);
        setNewTask(EMPTY_NEW_TASK);
        setShowModal(false);
      } catch (err) {
        console.error(err);
        alert("Failed to create task");
      } finally {
        setLoadingTask(false);
      }
    },
    [newTask, setTasks]
  );

  // -------------------------------------------------------
  // DRAG + DROP
  // -------------------------------------------------------
  const handleDrop = useCallback(
    async (e: React.DragEvent, newStatus: TaskStatus) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData("taskId");

      if (!taskId) return;
      const target = tasks.find((t) => t.id === taskId);
      if (!target || target.status === newStatus) return;

      const backup = [...tasks];

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );

      try {
        await updateTaskStatusInDB(taskId, newStatus);
      } catch (err) {
        console.error("Status update failed:", err);
        setTasks(backup);
        alert("Connection Error: Sync failed.");
      } finally {
        setDragOverColumnId(null);
      }
    },
    [tasks, setTasks]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (colId: TaskStatus) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumnId(colId);
  };

  const handleDragLeave = () => setDragOverColumnId(null);

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
  const columns = [
    {
      id: TaskStatus.TODO,
      label: "PENDING",
      color: "text-red-500",
      bg: "bg-red-950/5",
    },
    {
      id: TaskStatus.IN_PROGRESS,
      label: "ACTIVE",
      color: "text-yellow-500",
      bg: "bg-yellow-950/5",
    },
    {
      id: TaskStatus.DONE,
      label: "COMPLETED",
      color: "text-green-500",
      bg: "bg-green-950/5",
    },
  ];



  return (
    <div className="p-8 md:p-16 max-w-[1800px] mx-auto w-full h-full relative">
      {/* HEADER */}
      <header className="mb-12 flex justify-between items-end relative z-10 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tighter font-outfit">
            TASKS
          </h1>
          <p className="text-cyan-500 tracking-[0.3em] uppercase text-sm font-mono">
            Allocation Matrix
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-black px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-cyan-400 transition-colors flex items-center gap-3 clip-corner-tr shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <Plus size={18} /> ADD TASK
        </button>
      </header>

      {/* AI GENERATOR */}
      <PlanGenerator onPlanGenerated={addTasks} />

      {/* BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative z-10">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`flex flex-col h-full rounded-xl transition-colors duration-300 ${col.bg} ${dragOverColumnId === col.id ? "bg-blue-500/10" : ""
                }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              onDragEnter={handleDragEnter(col.id)}
              onDragLeave={handleDragLeave}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5 px-4 pt-4">
                <h3
                  className={`font-mono font-bold text-base ${col.color} tracking-widest`}
                >
                  {col.label}
                </h3>
                <span className="text-sm font-mono text-white bg-white/10 px-2 py-1 rounded">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-6 flex-1 px-2 pb-4 min-h-[200px]">
                {colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))}

                {colTasks.length === 0 && (
                  <div className="h-32 border border-dashed border-neutral-800 flex items-center justify-center bg-[#0d0d0d]/50 rounded-lg m-2">
                    <span className="text-neutral-600 text-xs font-mono uppercase tracking-widest">
                      DROP ZONE
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="bg-[#0d0d0d] border border-cyan-500/50 p-10 w-full max-w-lg relative shadow-[0_0_50px_rgba(6,182,212,0.2)] clip-corner-all">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-8 font-mono uppercase tracking-widest border-b border-white/10 pb-4 select-none">
              <Cpu size={24} className="inline-block mr-3 text-cyan-500" /> New
              Task
            </h2>

            <div className="space-y-6 font-mono">
              {/* TITLE */}
              <div>
                <label className="block text-xs text-cyan-500 uppercase mb-2">
                  Title
                </label>
                <input
                  className="w-full bg-black border border-neutral-800 p-4 text-white text-base focus:border-cyan-500 outline-none placeholder-neutral-700 transition-colors"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="TASK NAME..."
                  required
                />
              </div>

              {/* DESC */}
              <div>
                <label className="block text-xs text-cyan-500 uppercase mb-2">
                  Details
                </label>
                <textarea
                  className="w-full bg-black border border-neutral-800 p-4 text-white text-sm focus:border-cyan-500 outline-none h-32 resize-none placeholder-neutral-700 transition-colors"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="DETAILS..."
                  required
                />
              </div>

              {/* DATE / TIME */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-cyan-500 uppercase mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    className="w-full bg-black border border-neutral-800 p-4 text-white text-sm outline-none focus:border-cyan-500 transition-colors scheme-dark cursor-pointer"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask((p) => ({ ...p, dueDate: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-cyan-500 uppercase mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full bg-black border border-neutral-800 p-4 text-white text-sm outline-none focus:border-cyan-500 transition-colors scheme-dark cursor-pointer"
                    value={newTask.dueTime}
                    onChange={(e) =>
                      setNewTask((p) => ({ ...p, dueTime: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              {/* TAGS */}
              <div>
                <label className="block text-xs text-cyan-500 uppercase mb-2">
                  Tags
                </label>
                <input
                  className="w-full bg-black border border-neutral-800 p-4 text-white text-sm focus:border-cyan-500 outline-none placeholder-neutral-700 transition-colors"
                  value={newTask.tags}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, tags: e.target.value }))
                  }
                  placeholder="DESIGN, BACKEND..."
                />
              </div>

              {/* SUBMIT */}
              <button
                onClick={handleManualSubmit}
                disabled={!newTask.title || loadingTask}
                className="w-full mt-8 bg-cyan-900/20 border border-cyan-500/50 text-cyan-400 py-5 font-bold text-sm hover:bg-cyan-500 hover:text-black transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingTask ? "Saving..." : "CONFIRM"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
