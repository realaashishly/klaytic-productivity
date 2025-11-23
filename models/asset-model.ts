import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true },
    key: { type: String, required: true }, // UploadThing file key
    uploadDate: { type: String, required: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Prevent recompiling model in Next.js
export const AssetModel = mongoose.models.Asset || mongoose.model('Asset', AssetSchema);
