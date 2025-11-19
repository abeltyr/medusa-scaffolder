#!/usr/bin/env node

import { Command } from "commander";
import { Project } from "ts-morph";
import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import { modelExtractor } from "./model";
import { getAllFiles } from "./utils/getAllFiles";

const program = new Command();

program
  .name("medusa-gen")
  .description("Generate Types, Steps, and Workflows from a Medusa Model")
  .version("1.0.0")
  .argument(
    "<ModuleName>",
    "Path to the module folder containing model files (e.g., src/modules/finance/models)",
  )
  .option("-o, --output <dir>", "Output root directory", "src/modules")
  .action(async (moduleName, options) => {
    const filePaths = getAllFiles(`src/modules/${moduleName}/models`);

    let fileName,
      srcDir = "";
    for (const filePath of filePaths) {
      if (filePath.includes("index.ts")) {
        continue;
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

      const data = await modelExtractor({
        sourceFile,
        absolutePath,
      });
      fileName = data.fileName;
      srcDir = data.srcDir;
    }

    const moduleWorkflowDir = path.join(srcDir, `workflows/${fileName}`);
    const moduleWorkflowPath = path.join(moduleWorkflowDir, "index.ts");
    await fs.appendFile(
      moduleWorkflowPath,
      `
export * from "./steps";
export * from "./workflows";
    `,
    );

    const typesDir = path.join(srcDir, `types`);
    const typesFullPath = path.join(typesDir, "index.ts");
    await fs.appendFile(typesFullPath, `export * from './${fileName}';\n`);

    const workDir = path.join(srcDir, `workflows`);
    const workFullPath = path.join(workDir, "index.ts");
    await fs.appendFile(workFullPath, `export * from './${fileName}';\n`);
  });

program.parse();
