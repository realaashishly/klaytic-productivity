import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { 
    type: String, 
    enum: ['TODO', 'IN_PROGRESS', 'DONE'], 
    default: 'TODO' 
  },
  dueDate: Date,
  tags: [String],
  priority: Number,
  aiGenerated: { type: Boolean, default: false }
}, { timestamps: true });

// Prevent recompiling model in Next.js
export const TaskModel = mongoose.models.Task || mongoose.model('Task', TaskSchema);