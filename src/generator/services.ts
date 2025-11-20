import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import generateCreate from "../templates/router/service/create";
import generateUpdate from "../templates/router/service/update";
import generateDelete from "../templates/router/service/delete";
import generateGet from "../templates/router/service/get";
import generateGetAll from "../templates/router/service/getAll";
import { GenerateFileData } from "../type/shard";
import generateIndexService from '../templates/index/service';

export const serviceGenerator = async ({
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
      type: "generateCreateService",
      dir: path.join(srcDir, `router/service/${fileName}/${baseFileName}`),
      file: `create.ts`,
      content: generateCreate(data),
      shouldIndex: false,
    },
    {
      type: "generateUpdateService",
      dir: path.join(srcDir, `router/service/${fileName}/${baseFileName}`),
      file: `update.ts`,
      content: generateUpdate(data),
      shouldIndex: false,
    },
    {
      type: "generateDeleteService",
      dir: path.join(srcDir, `router/service/${fileName}/${baseFileName}`),
      file: `delete.ts`,
      content: generateDelete(data),
      shouldIndex: false,
    },
    {
      type: "generateGetService",
      dir: path.join(srcDir, `router/service/${fileName}/${baseFileName}`),
      file: `get.ts`,
      content: generateGet(data),
      shouldIndex: false,
    },
    {
      type: "generateGetAllService",
      dir: path.join(srcDir, `router/service/${fileName}/${baseFileName}`),
      file: `getAll.ts`,
      content: generateGetAll(data),
      shouldIndex: false,
    },
    {
      type: "generateGetAllService",
      dir: path.join(srcDir, `router/service/${fileName}/${baseFileName}`),
      file: `index.ts`,
      content: generateIndexService(),
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

  const workflowDir = path.join(srcDir, `router/service/${fileName}`);
  const workflowFullPath = path.join(workflowDir, "index.ts");
  await fs.appendFile(workflowFullPath, `export * from './${baseFileName}';\n`);

  console.log(
    chalk.blue(
      `\nGeneration Service ${baseFileName} from ${fileName} Complete! 🚀`,
    ),
  );
};