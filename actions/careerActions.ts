'use server'

import { auth } from "@/lib/better-auth/auth";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { CareerChatMessage } from "@/types";

const getSession = async () => {
    return await auth.api.getSession({
        headers: await headers()
    });
};

export const getCareerSessions = async () => {
    const session = await getSession();
    if (!session?.user) return [];

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("career_sessions");

        const sessions = await collection.find({ userId: new ObjectId(session.user.id) })
            .sort({ updatedAt: -1 })
            .toArray();

        return sessions.map(s => ({
            ...s,
            _id: s._id.toString(),
            userId: s.userId.toString(),
            id: s._id.toString(),
        })).map(s => JSON.parse(JSON.stringify(s)));
    } catch (error) {
        console.error("Error fetching career sessions:", error);
        return [];
    }
};

export const createCareerSession = async (title: string = 'New Career Analysis') => {
    const session = await getSession();
    if (!session?.user) return null;

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("career_sessions");

        const newSession = {
            userId: new ObjectId(session.user.id),
            title,
            date: new Date(),
            messages: [{
                id: 'init',
                role: 'ai',
                content: "Career Advisor online. How can I assist your professional growth today?",
                type: 'text'
            }],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(newSession);

        const createdSession = {
            ...newSession,
            _id: result.insertedId.toString(),
            userId: newSession.userId.toString(),
            id: result.insertedId.toString(),
        };

        return JSON.parse(JSON.stringify(createdSession));
    } catch (error) {
        console.error("Error creating career session:", error);
        return null;
    }
};

export const addMessageToSession = async (sessionId: string, message: CareerChatMessage) => {
    const session = await getSession();
    if (!session?.user) return null;

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("career_sessions");

        await collection.updateOne(
            { _id: new ObjectId(sessionId), userId: new ObjectId(session.user.id) },
            {
                $push: { messages: message } as any,
                $set: { updatedAt: new Date() }
            }
        );
        return true;
    } catch (error) {
        console.error("Error adding message to session:", error);
        return false;
    }
};

export const updateSessionTitle = async (sessionId: string, title: string) => {
    const session = await getSession();
    if (!session?.user) return null;

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("career_sessions");

        await collection.updateOne(
            { _id: new ObjectId(sessionId), userId: new ObjectId(session.user.id) },
            { $set: { title, updatedAt: new Date() } }
        );
        return true;
    } catch (error) {
        console.error("Error updating session title:", error);
        return false;
    }
};

export const deleteSession = async (sessionId: string) => {
    const session = await getSession();
    if (!session?.user) return null;

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("career_sessions");

        await collection.deleteOne({ _id: new ObjectId(sessionId), userId: new ObjectId(session.user.id) });
        return true;
    } catch (error) {
        console.error("Error deleting session:", error);
        return false;
    }
};
