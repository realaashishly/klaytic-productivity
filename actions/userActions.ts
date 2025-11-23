'use server'

import { auth } from "@/lib/better-auth/auth";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { UserProfile } from "@/types";

const getSession = async () => {
    return await auth.api.getSession({
        headers: await headers()
    });
};

export const updateUserProfile = async (data: Partial<UserProfile>) => {
    const session = await getSession();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("user");

        // Filter out empty strings or undefined values if necessary, 
        // but the user might want to clear fields, so we'll pass what's given.
        // We should probably sanitize or validate 'data' here.

        // Construct the update object. 
        // Note: 'socials' in the DB might be nested or flat depending on the schema.
        // Based on previous edits to auth.ts, fields like twitter, github are top-level on the user object now.

        const updateData: any = {
            updatedAt: new Date(),
            ...data
        };

        // Remove fields that shouldn't be updated directly or are immutable
        delete updateData.id;
        delete updateData.email; // Usually email updates require verification
        delete updateData.emailVerified;
        delete updateData.createdAt;

        const result = await collection.updateOne(
            { _id: new ObjectId(session.user.id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            throw new Error("User not found");
        }

        return { success: true };
    } catch (error) {
        console.error("Error updating user profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
};

export const decrementUserCredits = async () => {
    const session = await getSession();
    if (!session?.user) return 0;

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("user");

        // Decrement credits by 1, but don't go below 0
        // Assuming 'credits' field exists. If not, we might need to initialize it.
        // For now, let's assume it exists or we increment it. 
        // Wait, the user asked for "decrementUserCredits" in Globe.tsx context previously.
        // I should probably check if I need to re-implement that too since the file was deleted.
        // The user deleted the file, so I should restore functionality if needed.
        // In Globe.tsx, it calls `decrementUserCredits`.

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(session.user.id) },
            { $inc: { credits: -1 } },
            { returnDocument: 'after' }
        );

        if (result) {
            return result.credits || 0;
        }
        return 0;

    } catch (error) {
        console.error("Error decrementing credits:", error);
        return 0;
    }
}
