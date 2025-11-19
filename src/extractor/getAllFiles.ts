import fs from "fs";
import path from "path";

// Recursively get all files inside a folder
export const getAllFiles = (folderPath: string): string[] => {
  let results: string[] = [];

  const list = fs.readdirSync(folderPath);

  for (const file of list) {
    const fullPath = path.join(folderPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath)); // recurse
    } else {
      results.push(fullPath);
    }
  }

  return results;
};
