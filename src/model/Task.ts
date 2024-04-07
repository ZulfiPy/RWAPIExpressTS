import { Schema, model } from "mongoose";

interface Task {
    title: String,
    description: String,
    priority: String,
    status: String,
}

const taskSchema = new Schema<Task>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, required: true },
    status: { type: String, required: true }
}, {
    timestamps: true
});

const Task = model<Task>('Task', taskSchema);

export default Task;