'use server'

import { auth } from "@/lib/better-auth/auth";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { Asset } from "@/types";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

const getSession = async () => {
    return await auth.api.getSession({
        headers: await headers()
    });
};

export const getAssets = async () => {
    const session = await getSession();
    if (!session?.user) return [];

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("assets");

        const assets = await collection.find({ userId: new ObjectId(session.user.id) })
            .sort({ createdAt: -1 })
            .toArray();

        return assets.map(a => ({
            ...a,
            _id: a._id.toString(),
            userId: a.userId.toString(),
            id: a._id.toString(),
        })).map(a => JSON.parse(JSON.stringify(a)));
    } catch (error) {
        console.error("Error fetching assets:", error);
        return [];
    }
};

export const createAsset = async (asset: Omit<Asset, 'id'> & { key: string }) => {
    const session = await getSession();
    if (!session?.user) return null;

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("assets");

        const newAsset = {
            userId: new ObjectId(session.user.id),
            name: asset.name,
            size: asset.size,
            type: asset.type,
            url: asset.url,
            key: asset.key,
            uploadDate: asset.uploadDate,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(newAsset);

        const createdAsset = {
            ...newAsset,
            _id: result.insertedId.toString(),
            userId: newAsset.userId.toString(),
            id: result.insertedId.toString(),
        };

        return JSON.parse(JSON.stringify(createdAsset));
    } catch (error) {
        console.error("Error creating asset:", error);
        return null;
    }
};

export const deleteAsset = async (assetId: string, fileKey: string) => {
    const session = await getSession();
    if (!session?.user) return false;

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("assets");

        // Delete from UploadThing
        if (fileKey) {
            await utapi.deleteFiles(fileKey);
        }

        // Delete from DB
        await collection.deleteOne({ _id: new ObjectId(assetId), userId: new ObjectId(session.user.id) });
        return true;
    } catch (error) {
        console.error("Error deleting asset:", error);
        return false;
    }
};
