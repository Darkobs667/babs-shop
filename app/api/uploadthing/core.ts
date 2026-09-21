import { createUploadthing, type FileRouter } from "uploadthing/next";
import { isAdmin } from "@/lib/auth";

const f = createUploadthing();
export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .middleware(async () => {
      if (!(await isAdmin())) throw new Error("Non autorisé");
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
