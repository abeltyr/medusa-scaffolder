#!/usr/bin/env node

import { Command } from "commander";
import { Project, SyntaxKind, VariableDeclaration } from "ts-morph";
import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import { toKebabCase } from "./utils";
import {
  generateHttpTypes,
  generateModuleTypes,
  generateQueryTypes,
  generateServiceTypes,
} from "./templates/type";
import {
  generateCreateSteps,
  generateCreateWorkflows,
  generateUpdateSteps,
  generateUpdateWorkflows,
  generateDeleteSteps,
  generateDeleteWorkflows,
} from "./templates/workflows";
import { TemplateData } from "./type/shard";
import { generateIndexTypes } from "./templates/index/type";
import { generateIndexWorkflows } from "./templates/index/workflows";
import { modelExtractor } from "./model";
import { getAllFiles } from "./utils/getAllFiles";

const program = new Command();

program
  .name("medusa-gen")
  .description("Generate Types, Steps, and Workflows from a Medusa Model")
  .version("1.0.0")
  .argument(
    "<folder>",
    "Path to the folder containing model files (e.g., src/modules/finance/models)",
  )
  .option("-o, --output <dir>", "Output root directory", "src/modules")
  .action(async (folderPath, options) => {
    const filePaths = getAllFiles(folderPath);
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

      await modelExtractor({ sourceFile, absolutePath });
    }
  });

program.parse();
