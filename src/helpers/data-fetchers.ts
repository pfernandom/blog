import fsPromises from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

export async function getDataFile<T>(dataFilePath: string): Promise<T> {
  const filePath = path.join(process.cwd(), dataFilePath);
  const file = await fsPromises.readFile(filePath, 'utf-8');
  return JSON.parse(file);
}

export async function getDataFiles<T>(dataFilePath: string): Promise<Array<T>> {
  const filePath = path.join(process.cwd(), dataFilePath);
  const allFiles = await fsPromises.readdir(filePath, 'utf-8');
  const file = await Promise.all(
    allFiles.map(element => {
      return fsPromises.readFile(`${dataFilePath}${element}`, 'utf-8');
    }),
  );
  return file.map((element, index) => {
    if (allFiles[index].includes('md')) {
      const contents = matter(element);
      return { content: contents.content, ...contents.data };
    }
    return JSON.parse(element);
  });
}
