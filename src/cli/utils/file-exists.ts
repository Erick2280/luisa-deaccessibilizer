import { stat } from 'node:fs/promises';

export const fileExists = async (path: string): Promise<boolean> => {
  try {
    const fileStat = await stat(path);
    return fileStat.isFile();
  } catch (error) {
    if ((error as { code?: string })?.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
};
