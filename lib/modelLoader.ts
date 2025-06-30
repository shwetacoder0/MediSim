import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

/**
 * Fetch a GLB model file from a URL and save it locally for use in Three.js
 * @param url The URL to fetch the model from
 * @returns Promise with the local file URI or null if failed
 */
export async function fetchModelFromUrl(url: string): Promise<string | null> {
  try {
    console.log('Fetching model from URL:', url);

    // Create a unique filename based on the URL
    const filename = url.split('/').pop();
    if (!filename) {
      throw new Error('Could not determine filename from URL');
    }

    // Path to save the file
    const localUri = `${FileSystem.documentDirectory}${filename}`;

    // Check if file exists already
    const fileInfo = await FileSystem.getInfoAsync(localUri);

    if (!fileInfo.exists) {
      console.log('File does not exist locally, downloading...');
      // Download the file
      const downloadResult = await FileSystem.downloadAsync(url, localUri);

      if (downloadResult.status !== 200) {
        console.error('Download failed with status:', downloadResult.status);
        return null;
      }

      console.log('Download successful, file saved at:', downloadResult.uri);
      return downloadResult.uri;
    } else {
      console.log('File already exists locally at:', localUri);
      return localUri;
    }
  } catch (error) {
    console.error('Error fetching model:', error);
    return null;
  }
}

/**
 * Log information about a GLB file
 * @param uri Local URI of the GLB file
 */
export async function logGlbInfo(uri: string): Promise<void> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    console.log('GLB File Info:', fileInfo);

    // Read first few bytes to check file signature
    if (fileInfo.exists && fileInfo.uri) {
      const header = await FileSystem.readAsStringAsync(fileInfo.uri, {
        encoding: FileSystem.EncodingType.Base64,
        length: 20,  // Just read a small part of the file
      });
      console.log('File header (base64):', header);
    }
  } catch (error) {
    console.error('Error logging GLB info:', error);
  }
}

/**
 * Checks if the URL points to a GLB file
 */
export function isGlbUrl(url: string): boolean {
  return url.toLowerCase().endsWith('.glb');
}
