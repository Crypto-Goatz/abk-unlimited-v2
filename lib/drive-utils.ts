/**
 * Pure utility functions for Google Drive URLs.
 * These are safe to import from client components (no googleapis dependency).
 */

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
  createdTime?: string;
}

export function getPublicUrl(fileId: string): string {
  if (fileId.startsWith("http://") || fileId.startsWith("https://")) {
    return fileId;
  }
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export function getThumbnailUrl(fileId: string, size: number = 400): string {
  if (fileId.startsWith("http://") || fileId.startsWith("https://")) {
    return fileId;
  }
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}
