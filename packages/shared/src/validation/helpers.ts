import { z } from "zod";

/** A MongoDB ObjectId: 24 hex characters */
export const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

/** A 24-char hex id; the label names it in the error, e.g. "Invalid task ID." */
export const objectId = (label?: string) =>
  z.string().trim().regex(OBJECT_ID_RE, { message: `Invalid ${label ? `${label} ` : ""}ID.` });

export const isValidTimeZone = (tz: string) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

export const NOTE_VISIBILITY = ["private", "workspace"] as const;
export type NoteVisibility = (typeof NOTE_VISIBILITY)[number];
