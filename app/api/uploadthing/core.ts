import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

const f = createUploadthing();

const handleAuth = async () => {
    console.log("UploadThing: handleAuth started");
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        console.log("UploadThing: Session retrieved", session?.user?.id);
        if (!session?.user) {
            console.error("UploadThing: No user in session");
            throw new Error("Unauthorized");
        }
        return { userId: session.user.id };
    } catch (error) {
        console.error("UploadThing: Auth error", error);
        throw new Error("Unauthorized");
    }
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    assetUploader: f({ image: { maxFileSize: "16MB" }, pdf: { maxFileSize: "16MB" }, text: { maxFileSize: "16MB" }, video: { maxFileSize: "16MB" }, blob: { maxFileSize: "16MB" } })
        // Set permissions and file types for this FileRoute
        .middleware(async () => {
            console.log("UploadThing: Middleware started");
            // This code runs on your server before upload
            const user = await handleAuth();

            // If you throw, the user will not be able to upload
            if (!user) throw new Error("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId, url: file.url, name: file.name, size: file.size, key: file.key };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
