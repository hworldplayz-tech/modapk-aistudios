/**
 * Utility functions for Google Drive links and direct download resolution
 */

export interface GoogleDriveInfo {
  isDrive: boolean;
  fileId: string | null;
  directDownloadUrl: string | null;
  previewUrl: string | null;
}

/**
 * Extracts Google Drive file ID from various Drive URL formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/uc?export=download&id=FILE_ID
 * - https://docs.google.com/uc?export=download&id=FILE_ID
 */
export function parseGoogleDriveUrl(url: string): GoogleDriveInfo {
  if (!url || typeof url !== 'string') {
    return { isDrive: false, fileId: null, directDownloadUrl: null, previewUrl: null };
  }

  const trimmed = url.trim();

  // Match /file/d/ID pattern
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (fileDMatch && fileDMatch[1]) {
    const fileId = fileDMatch[1];
    return {
      isDrive: true,
      fileId,
      directDownloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      previewUrl: `https://drive.google.com/file/d/${fileId}/view`
    };
  }

  // Match ?id=ID or &id=ID pattern (e.g. drive.google.com/open?id=... or /uc?id=...)
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if ((trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) && idParamMatch && idParamMatch[1]) {
    const fileId = idParamMatch[1];
    return {
      isDrive: true,
      fileId,
      directDownloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      previewUrl: `https://drive.google.com/file/d/${fileId}/view`
    };
  }

  // Check if it's already a direct Google Drive link
  if (trimmed.includes('drive.google.com/uc') && trimmed.includes('export=download')) {
    const idMatch = trimmed.match(/id=([a-zA-Z0-9_-]+)/i);
    const fileId = idMatch ? idMatch[1] : null;
    return {
      isDrive: true,
      fileId,
      directDownloadUrl: trimmed,
      previewUrl: fileId ? `https://drive.google.com/file/d/${fileId}/view` : trimmed
    };
  }

  return { isDrive: false, fileId: null, directDownloadUrl: null, previewUrl: null };
}

/**
 * Converts any URL if it is a Google Drive link into an ultra-fast 1-click direct download link.
 * If not Google Drive, returns the original URL untouched.
 */
export function getDirectDownloadUrl(url: string): string {
  const driveInfo = parseGoogleDriveUrl(url);
  if (driveInfo.isDrive && driveInfo.directDownloadUrl) {
    return driveInfo.directDownloadUrl;
  }
  return url;
}

/**
 * Checks if a download URL is a direct APK file (like GitHub Releases, Catbox, direct CDN)
 * vs a third-party hosted page (like Mega, Mediafire landing page, Telegram, etc.)
 */
export function isDirectDownloadableUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  
  // GitHub Releases assets
  if (lower.includes('github.com') && lower.includes('/releases/download/')) return true;
  if (lower.includes('objects.githubusercontent.com') || lower.includes('release-assets.githubusercontent.com')) return true;
  
  // Google Drive direct export
  if (lower.includes('drive.google.com/uc') && lower.includes('export=download')) return true;

  // Direct APK or binary file extensions
  if (lower.includes('.apk') || lower.includes('.zip') || lower.includes('.xapk')) return true;

  // Catbox / direct storage hosts
  if (lower.includes('catbox.moe') || lower.includes('litterbox.catbox.moe')) return true;

  return false;
}

