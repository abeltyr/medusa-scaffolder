import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";

import generateIndexWorkflows from "../templates/index/workflows";
import generateCreateSteps from "../templates/workflows/step/create";
import generateUpdateSteps from "../templates/workflows/step/update";
import generateDeleteSteps from "../templates/workflows/step/delete";
import generateCreateWorkflows from "../templates/workflows/workflow/create";
import generateUpdateWorkflows from "../templates/workflows/workflow/update";
import generateDeleteWorkflows from "../templates/workflows/workflow/delete";
import { GenerateFileData } from "../type/shard";

export const workflowGenerator = async ({
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
      type: "generateCreateSteps",
      dir: path.join(srcDir, `workflows/${fileName}/steps/${baseFileName}`),
      file: `create.ts`,
      content: generateCreateSteps(data),
      shouldIndex: true,
    },
    {
      type: "generateUpdateSteps",
      dir: path.join(srcDir, `workflows/${fileName}/steps/${baseFileName}`),
      file: `update.ts`,
      content: generateUpdateSteps(data),
      shouldIndex: true,
    },
    {
      type: "generateDeleteSteps",
      dir: path.join(srcDir, `workflows/${fileName}/steps/${baseFileName}`),
      file: `delete.ts`,
      content: generateDeleteSteps(data),
      shouldIndex: true,
    },
    {
      type: "generateIndexWorkflows",
      dir: path.join(srcDir, `workflows/${fileName}/steps/${baseFileName}`),
      file: `index.ts`,
      content: generateIndexWorkflows(),
      shouldIndex: false,
    },
    {
      type: "generateCreateWorkflows",
      dir: path.join(srcDir, `workflows/${fileName}/workflows/${baseFileName}`),
      file: `create.ts`,
      content: generateCreateWorkflows(data),
      shouldIndex: true,
    },
    {
      type: "generateUpdateWorkflows",
      dir: path.join(srcDir, `workflows/${fileName}/workflows/${baseFileName}`),
      file: `update.ts`,
      content: generateUpdateWorkflows(data),
      shouldIndex: true,
    },
    {
      type: "generateDeleteWorkflows",
      dir: path.join(srcDir, `workflows/${fileName}/workflows/${baseFileName}`),
      file: `delete.ts`,
      content: generateDeleteWorkflows(data),
      shouldIndex: true,
    },
    {
      type: "generateIndexWorkflows",
      dir: path.join(srcDir, `workflows/${fileName}/workflows/${baseFileName}`),
      file: `index.ts`,
      content: generateIndexWorkflows(),
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

  const workflowDir = path.join(srcDir, `workflows/${fileName}/workflows`);
  const workflowFullPath = path.join(workflowDir, "index.ts");
  await fs.appendFile(workflowFullPath, `export * from './${baseFileName}';\n`);

  const stepDir = path.join(srcDir, `workflows/${fileName}/steps`);
  const stepFullPath = path.join(stepDir, "index.ts");
  await fs.appendFile(stepFullPath, `export * from './${baseFileName}';\n`);

  console.log(
    chalk.blue(
      `\nGeneration workflow ${baseFileName} from ${fileName} Complete! 🚀`,
    ),
  );
};

// TODO:Optimize the index setup to prevent repetition of steps and workflows
export const workflowIndexGenerator = async ({
  fileName,
  srcDir,
}: {
  fileName: string;
  srcDir: string;
}) => {
  const moduleWorkflowDir = path.join(srcDir, `workflows/${fileName}`);
  const moduleWorkflowPath = path.join(moduleWorkflowDir, "index.ts");
  await fs.appendFile(
    moduleWorkflowPath,
    `
export * from "./steps";
export * from "./workflows";
    `,
  );

  const workDir = path.join(srcDir, `workflows`);
  const workFullPath = path.join(workDir, "index.ts");
  await fs.appendFile(workFullPath, `export * from './${fileName}';\n`);
};
