import type { createServerClient } from "@insforge/sdk/ssr";

type InsforgeClient = ReturnType<typeof createServerClient>;

// Parse storage key from a full public resume PDF URL
export function parseStorageKeyFromUrl(url: string, userId: string): string {
  try {
    const urlObj = new URL(url);
    const objectsPrefix = "/objects/";
    const objectsIndex = urlObj.pathname.indexOf(objectsPrefix);
    if (objectsIndex !== -1) {
      let encodedKey = urlObj.pathname.substring(objectsIndex + objectsPrefix.length);
      encodedKey = decodeURIComponent(encodedKey);
      if (encodedKey.startsWith("resumes/")) {
        return encodedKey.substring("resumes/".length);
      }
      return encodedKey;
    }
  } catch (err) {
    console.warn("[StorageManager] Failed to parse resume storage URL:", err);
  }
  return `${userId}/resume.pdf`; // default fallback key
}

// Delete a specific resume file from storage using its public URL
export async function deleteResumeFromStorage(insforge: InsforgeClient, url: string, userId: string): Promise<void> {
  const key = parseStorageKeyFromUrl(url, userId);
  try {
    await insforge.storage.from("resumes").remove(key);
  } catch (err) {
    console.warn(`[StorageManager] Failed to remove resume key ${key} from storage:`, err);
  }
}

// Consolidate cleaning up the old resume files from storage
export async function cleanOldResume(
  insforge: InsforgeClient,
  userId: string,
  oldUrl: string | null | undefined
): Promise<void> {
  if (oldUrl) {
    await deleteResumeFromStorage(insforge, oldUrl, userId);
  }
  
  // Also clean up the default location to avoid conflict/duplication
  try {
    await insforge.storage.from("resumes").remove(`${userId}/resume.pdf`);
  } catch {
    // Ignore error
  }
}
