import mongoose from 'mongoose';

const CareerSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    messages: [{
        id: String,
        role: { type: String, enum: ['user', 'ai'], required: true },
        content: String,
        type: { type: String, enum: ['text', 'result'], default: 'text' },
        data: {
            roleTitle: String,
            salaryRange: String,
            growthTrend: String,
            roadmap: [String],
            recommendedSkills: [String]
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Prevent recompiling model in Next.js
export const CareerSessionModel = mongoose.models.CareerSession || mongoose.model('CareerSession', CareerSessionSchema);
