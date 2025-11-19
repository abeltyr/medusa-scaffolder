#!/usr/bin/env node

import { Command } from "commander";
import { Project } from "ts-morph";
import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import { modelExtractor } from "./model";
import { getAllFiles } from "./utils/getAllFiles";
import { nameExtractor } from "./extractor/name";
import { typeGenerator, typeIndexGenerator } from "./generator/type";
import {
  workflowGenerator,
  workflowIndexGenerator,
} from "./generator/workflow";
import { sourceExtractor } from "./extractor/source";

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
  .action(async (moduleName, options) => {
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

      await typeGenerator({ ...data, start, updateState });

      await workflowGenerator({ ...data, start, updateState });

      fileName = data.fileName;
      srcDir = data.srcDir;
    }

    await workflowIndexGenerator({ fileName, srcDir });
    await typeIndexGenerator({ fileName, srcDir });
  });

program.parse();
