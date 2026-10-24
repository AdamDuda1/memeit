import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

// Opens the gallery. Returns the picked image's uri, or null if the user cancelled.
export async function pickImage(): Promise<string | null> {
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] });
  if (res.canceled) return null;
  return res.assets[0].uri;
}

// Shrinks the image to max 1080px wide and saves it as WebP (much smaller file).
export async function compress(uri: string): Promise<string> {
  const ctx = ImageManipulator.manipulate(uri);
  ctx.resize({ width: 1080 });
  const rendered = await ctx.renderAsync();
  const out = await rendered.saveAsync({ format: SaveFormat.WEBP, compress: 0.8 });
  return out.uri;
}
