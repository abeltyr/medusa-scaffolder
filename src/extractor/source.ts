import chalk from "chalk";
import path from "path";
import { Project } from "ts-morph";
import * as fs from "fs-extra";

export const sourceExtractor = async ({ filePath }: { filePath: string }) => {
  if (filePath.includes("index.ts")) {
    return;
  }
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.error(chalk.red(`Error: File not found at ${absolutePath}`));
    process.exit(1);
  }

  console.log(chalk.blue(`Reading ${path.basename(absolutePath)}...`));

  // 1. Parse the Model File
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(absolutePath);

  return { sourceFile, absolutePath };
};
