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

const program = new Command();

program
  .name("medusa-gen")
  .description("Generate Types, Steps, and Workflows from a Medusa Model")
  .version("1.0.0")
  .argument(
    "<file>",
    "Path to the model file (e.g., src/modules/finance/models/credit-wallet.ts)",
  )
  .option("-o, --output <dir>", "Output root directory", "src/modules")
  .action(async (filePath, options) => {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      console.error(chalk.red(`Error: File not found at ${absolutePath}`));
      process.exit(1);
    }

    console.log(chalk.blue(`Reading ${path.basename(absolutePath)}...`));

    // 1. Parse the Model File
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(absolutePath);

    // We need to find the exported variable that holds the model definition.
    // We look for: export const Name = model.define(...) OR model.define(...).indexes(...)
    let targetDecl: VariableDeclaration | undefined;

    const variableDeclarations = sourceFile.getVariableDeclarations();

    for (const decl of variableDeclarations) {
      if (!decl.isExported()) continue;

      const initializer = decl.getInitializer();
      if (!initializer) continue;

      const text = initializer.getText();

      // Check if this variable uses the Medusa 'model' utility
      if (text.includes("model")) {
        targetDecl = decl;
        break;
      }
    }

    if (!targetDecl) {
      console.error(
        chalk.red(
          "Error: Could not find an exported model definition (export const Name = model...).",
        ),
      );
      process.exit(1);
    }

    // 2. Extract Data
    const modelName = targetDecl.getName(); // e.g., "CreditWallet"

    // Find the specific call to .define("table_name")
    // Since define might be chained like .define().indexes(), we search descendants.
    const callExpressions = targetDecl.getDescendantsOfKind(
      SyntaxKind.CallExpression,
    );

    const defineCall = callExpressions.find((call) => {
      const expression = call.getExpression(); // The thing before the parens
      // We look for the text ending in '.define' (e.g. 'model.define')
      return expression.getText().endsWith(".define");
    });

    if (!defineCall) {
      console.error(
        chalk.red(
          `Error: Found ${modelName} but could not find '.define("name")' call inside it.`,
        ),
      );
      process.exit(1);
    }

    const args = defineCall.getArguments();
    let tableName = "";

    if (args.length > 0 && args[0].getKind() === SyntaxKind.StringLiteral) {
      // Extract "credit_wallet" from '"credit_wallet"'
      tableName = args[0].getText().replace(/['"]/g, "");
    } else {
      console.error(
        chalk.red(
          `Error: The first argument to .define() in ${modelName} must be a string literal.`,
        ),
      );
      process.exit(1);
    }

    console.log(chalk.green(`✓ Found Model Name: ${chalk.bold(modelName)}`));
    console.log(chalk.green(`✓ Found Table Name: ${chalk.bold(tableName)}`));

    // 3. Determine Output Paths
    // Source: src/modules/finance/models/credit-wallet.ts
    // Target: src/modules/finance/{types, steps, workflows}

    const modelDir = path.dirname(absolutePath); // Go up one level from 'from the file to the model'
    const currentModuleDir = path.dirname(modelDir); // Go up one level from 'from the model to the modules name'
    const modulesDir = path.dirname(currentModuleDir);
    const srcDir = path.dirname(modulesDir);

    // We use the original file name for the output files to maintain convention
    // e.g. credit-wallet.ts -> types/credit-wallet.ts
    const baseFileName = path.basename(absolutePath, ".ts");

    const fileName = path.basename(currentModuleDir);

    const data: TemplateData = { modelName, tableName, fileName };

    // 4. Generate Files
    const outputFiles = [
      {
        type: "HttpType",
        dir: path.join(srcDir, `types/${fileName}/http`),
        file: `${baseFileName}.ts`,
        content: generateHttpTypes(data),
        shouldIndex: true,
      },
      {
        type: "ModulesType",
        dir: path.join(srcDir, `types/${fileName}/module`),
        file: `${baseFileName}.ts`,
        content: generateModuleTypes(data),
        shouldIndex: true,
      },
      {
        type: "QueryType",
        dir: path.join(srcDir, `types/${fileName}/query`),
        file: `${baseFileName}.ts`,
        content: generateQueryTypes(data),
        shouldIndex: true,
      },
      {
        type: "ServiceType",
        dir: path.join(srcDir, `types/${fileName}/service`),
        file: `${baseFileName}.ts`,
        content: generateServiceTypes(data),
        shouldIndex: true,
      },
      {
        type: "generateIndexTypes",
        dir: path.join(srcDir, `types/${fileName}`),
        file: `index.ts`,
        content: generateIndexTypes(),
        shouldIndex: false,
      },

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
        dir: path.join(
          srcDir,
          `workflows/${fileName}/workflows/${baseFileName}`,
        ),
        file: `create.ts`,
        content: generateCreateWorkflows(data),
        shouldIndex: true,
      },
      {
        type: "generateUpdateWorkflows",
        dir: path.join(
          srcDir,
          `workflows/${fileName}/workflows/${baseFileName}`,
        ),
        file: `update.ts`,
        content: generateUpdateWorkflows(data),
        shouldIndex: true,
      },
      {
        type: "generateDeleteWorkflows",
        dir: path.join(
          srcDir,
          `workflows/${fileName}/workflows/${baseFileName}`,
        ),
        file: `delete.ts`,
        content: generateDeleteWorkflows(data),
        shouldIndex: true,
      },
      {
        type: "generateIndexWorkflows",
        dir: path.join(
          srcDir,
          `workflows/${fileName}/workflows/${baseFileName}`,
        ),
        file: `index.ts`,
        content: generateIndexWorkflows(),
        shouldIndex: false,
      },
    ];

    const indexedFiles = [];

    for (const item of outputFiles) {
      const fullPath = path.join(item.dir, item.file);
      await fs.ensureDir(item.dir);
      await fs.writeFile(fullPath, item.content);
      console.log(chalk.white(`Created ${item.type}: ${chalk.gray(fullPath)}`));

      if (item.shouldIndex) {
        const fullPath = path.join(item.dir, "index.ts");
        await fs.appendFile(
          fullPath,
          `export * from './${item.file.replace(".ts", "")}';\n`,
        );
      }
    }

    const workflowDir = path.join(srcDir, `workflows/${fileName}/workflows`);
    const workflowFullPath = path.join(workflowDir, "index.ts");
    await fs.appendFile(
      workflowFullPath,
      `export * from './${baseFileName}';\n`,
    );

    const stepDir = path.join(srcDir, `workflows/${fileName}/steps`);
    const stepFullPath = path.join(stepDir, "index.ts");
    await fs.appendFile(stepFullPath, `export * from './${baseFileName}';\n`);

    console.log(chalk.blue("\nGeneration Complete! 🚀"));
  });

program.parse();
