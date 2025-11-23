'use server'

import { auth } from "@/lib/better-auth/auth";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { LinkResource } from "@/types";

const getSession = async () => {
    return await auth.api.getSession({
        headers: await headers()
    });
};

export const getLinks = async () => {
    const session = await getSession();
    if (!session?.user) return [];

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("links");

        const links = await collection.find({ userId: new ObjectId(session.user.id) })
            .sort({ createdAt: -1 })
            .toArray();

        return links.map(l => ({
            ...l,
            _id: l._id.toString(),
            userId: l.userId.toString(),
            id: l._id.toString(),
        })).map(l => JSON.parse(JSON.stringify(l)));
    } catch (error) {
        console.error("Error fetching links:", error);
        return [];
    }
};

export const createLink = async (link: Omit<LinkResource, 'id'>) => {
    const session = await getSession();
    if (!session?.user) return null;

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("links");

        const newLink = {
            userId: new ObjectId(session.user.id),
            title: link.title,
            url: link.url,
            category: link.category || 'Uncategorized',
            description: link.description || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(newLink);

        const createdLink = {
            ...newLink,
            _id: result.insertedId.toString(),
            userId: newLink.userId.toString(),
            id: result.insertedId.toString(),
        };

        return JSON.parse(JSON.stringify(createdLink));
    } catch (error) {
        console.error("Error creating link:", error);
        return null;
    }
};

export const deleteLink = async (linkId: string) => {
    const session = await getSession();
    if (!session?.user) return false;

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("links");

        await collection.deleteOne({ _id: new ObjectId(linkId), userId: new ObjectId(session.user.id) });
        return true;
    } catch (error) {
        console.error("Error deleting link:", error);
        return false;
    }
};
