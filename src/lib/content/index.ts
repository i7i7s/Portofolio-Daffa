import "server-only";
import profileData from "../../../content/profile.json";
import projectData from "../../../content/projects.json";
import photoData from "../../../content/photography.json";
import { profileSchema, projectSchema, photoSchema } from "./schema";
export const preview =
  process.env.CONTENT_PREVIEW === "true" ||
  (process.env.NODE_ENV === "development" &&
    process.env.CONTENT_PREVIEW !== "false");
export const profile = profileSchema.parse(profileData);
export const projects = projectSchema
  .array()
  .parse(projectData)
  .filter((p) => preview || (p.status === "published" && !p.sample))
  .sort((a, b) => a.order - b.order);
export const photos = photoSchema
  .array()
  .parse(photoData)
  .filter((p) => preview || (p.status === "published" && !p.sample))
  .sort((a, b) => a.order - b.order);
