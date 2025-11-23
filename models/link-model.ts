import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: String, default: 'Uncategorized' },
    description: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Prevent recompiling model in Next.js
export const LinkModel = mongoose.models.Link || mongoose.model('Link', LinkSchema);
