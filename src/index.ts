#!/usr/bin/env node

import { Command } from "commander";
import { Project, SyntaxKind, VariableDeclaration } from "ts-morph";
import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import { toKebabCase } from "./utils";
import {
  generateTypes,
  generateSteps,
  generateWorkflow,
} from "./templates/type";

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
        console.log("text", text);
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

    const modelDir = path.dirname(absolutePath);
    const moduleDir = path.dirname(path.dirname(path.dirname(modelDir))); // Go up one level from 'models'

    // We use the original file name for the output files to maintain convention
    // e.g. credit-wallet.ts -> types/credit-wallet.ts
    const baseFileName = path.basename(absolutePath, ".ts");

    const data = { modelName, tableName };

    // 4. Generate Files
    const outputFiles = [
      {
        type: "Type",
        dir: path.join(moduleDir, "types"),
        file: `${baseFileName}.ts`,
        content: generateTypes(data),
      },
      {
        type: "Step",
        dir: path.join(moduleDir, "steps"),
        file: `create-${baseFileName}.ts`, // e.g. create-credit-wallet.ts
        content: generateSteps(data),
      },
      {
        type: "Workflow",
        dir: path.join(moduleDir, "workflows"),
        file: `create-${baseFileName}.ts`, // e.g. create-credit-wallet.ts
        content: generateWorkflow(data),
      },
    ];

    for (const item of outputFiles) {
      const fullPath = path.join(item.dir, item.file);
      await fs.ensureDir(item.dir);
      await fs.writeFile(fullPath, item.content);
      console.log(chalk.white(`Created ${item.type}: ${chalk.gray(fullPath)}`));
    }

    console.log(chalk.blue("\nGeneration Complete! 🚀"));
  });

program.parse();
