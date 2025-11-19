import { SourceFile, SyntaxKind, VariableDeclaration } from "ts-morph";
import * as path from "path";
import chalk from "chalk";

import { TemplateData } from "../type/shard";

export const nameExtractor = async ({
  sourceFile,
  absolutePath,
}: {
  sourceFile: SourceFile;
  absolutePath: string;
}) => {
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

  return { modelName, tableName, fileName, baseFileName, srcDir };
};
