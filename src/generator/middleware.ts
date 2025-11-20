import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import { GenerateFileData } from "../type/shard";
import generateAdminMiddleware from '../templates/router/middleware/admin';
import generateStoreMiddleware from '../templates/router/middleware/store';
import generateIndexMiddleware from '../templates/index/middleware';

export const middlewareGenerator = async ({
  baseFileName,
  modelName,
  tableName,
  fileName,
  srcDir,
  start,
  updateState,
}: GenerateFileData) => {
  const data = { modelName, tableName, fileName };

  // 4. Generate Files
  const outputFiles = [
    {
      type: "generateAdminMiddleware",
      dir: path.join(srcDir, `router/middleware/${fileName}/${baseFileName}`),
      file: `admin.ts`,
      content: generateAdminMiddleware(data),
      shouldIndex: false,
    },
    {
      type: "generateStoreMiddleware",
      dir: path.join(srcDir, `router/middleware/${fileName}/${baseFileName}`),
      file: `store.ts`,
      content: generateStoreMiddleware(data),
      shouldIndex: false,
    },
    {
      type: "generateIndexMiddleware",
      dir: path.join(srcDir, `router/middleware/${fileName}/${baseFileName}`),
      file: `index.ts`,
      content: generateIndexMiddleware(),
      shouldIndex: false,
    },

  ];
  for (const item of outputFiles) {
    const fullPath = path.join(item.dir, item.file);
    await fs.ensureDir(item.dir);
    await fs.writeFile(fullPath, item.content);
    console.log(chalk.white(`Created ${item.type}: ${chalk.gray(fullPath)}`));

    if (item.shouldIndex) {
      const fullPath = path.join(item.dir, "index.ts");
      if (start) {
        await fs.writeFile(
          fullPath,
          `export * from './${item.file.replace(".ts", "")}';\n`,
        );
        updateState(false);
      } else
        await fs.appendFile(
          fullPath,
          `export * from './${item.file.replace(".ts", "")}';\n`,
        );
    }
  }

  const workflowDir = path.join(srcDir, `router/middleware/${fileName}`);
  const workflowFullPath = path.join(workflowDir, "index.ts");
  await fs.appendFile(workflowFullPath, `export * from './${baseFileName}';\n`);

  console.log(
    chalk.blue(
      `\nGeneration Service ${baseFileName} from ${fileName} Complete! 🚀`,
    ),
  );
};