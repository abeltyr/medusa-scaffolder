#!/usr/bin/env node

import { Command } from "commander";
import { getAllFiles } from "./extractor/getAllFiles";
import { nameExtractor } from "./extractor/name";
import { typeGenerator, typeIndexGenerator } from "./generator/type";
import { workflowGenerator, workflowIndexGenerator } from "./generator/workflow";
import { sourceExtractor } from "./extractor/source";
import { serviceGenerator } from './generator/services';
import { middlewareGenerator } from './generator/middleware';
import { validationGenerator } from './generator/validation';
import { queryGenerator } from './generator/query';
import { apiGenerator } from './generator/api';

const program = new Command();

program
  .name("medusa-gen")
  .description("Generate Types, Workflows from a Medusa Model")
  .version("1.0.0")
  .argument(
    "<ModuleName>",
    "Path to the module folder containing model files (e.g., src/modules/finance/models)",
  )
  .option("-o, --output <dir>", "Output root directory", "src/modules")
  .option("--type", "Generate type files")
  .option("--workflow", "Generate workflow files")
  .option("--service", "Generate service files")
  .option("--middleware", "Generate middleware files")
  .option("--api", "Generate api route files")
  .option("--validation", "Generate validator files")
  .option("--query", "Generate query configuration files")
  .option("--all", "Generate everything")
  .action(async (moduleName, options) => {
    const selected = [];

    if (options.all) selected.push("type", "workflow", "service", "middleware", "api", "validation", "query");
    if (options.type) selected.push("type");
    if (options.workflow) selected.push("workflow");
    if (options.service) selected.push("service");
    if (options.middleware) selected.push("middleware");
    if (options.api) selected.push("api");
    if (options.validation) selected.push("validation");
    if (options.query) selected.push("query");


    const filePaths = getAllFiles(`src/modules/${moduleName}/models`);
    let fileName: string = "";
    let srcDir: string = "";

    let start = true;
    const updateState = (data: boolean) => {
      start = data;
    };
    for (const filePath of filePaths) {
      const pathData = await sourceExtractor({ filePath });

      if (!pathData) {
        continue;
      }
      const { sourceFile, absolutePath } = pathData;

      const data = await nameExtractor({
        sourceFile,
        absolutePath,
      });

      if (selected.includes("type")) {
        await typeGenerator({ ...data, start, updateState });
      }

      if (selected.includes("workflow")) {
        await workflowGenerator({ ...data, start, updateState });
      }

      if (selected.includes("service")) {
        await serviceGenerator({ ...data, start, updateState });
      }


      if (selected.includes("middleware")) {
        await middlewareGenerator({ ...data, start, updateState });
      }

      if (selected.includes("api")) {
        await apiGenerator({ ...data, start, updateState });
      }

      if (selected.includes("validation")) {
        await validationGenerator({ ...data, start, updateState });
      }

      if (selected.includes("query")) {
        await queryGenerator({ ...data, start, updateState });
      }

      fileName = data.fileName;
      srcDir = data.srcDir;
    }

    if (selected.includes("workflow")) {
      await workflowIndexGenerator({ fileName, srcDir });
    }
    if (selected.includes("type")) {
      await typeIndexGenerator({ fileName, srcDir });
    }
  });

program.parse();
