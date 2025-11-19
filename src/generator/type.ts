import { SourceFile } from "ts-morph";
import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";

import generateHttpTypes from "../templates/type/http";
import generateModuleTypes from "../templates/type/module";
import generateQueryTypes from "../templates/type/query";
import generateServiceTypes from "../templates/type/service";
import generateIndexTypes from "../templates/index/type";
import { GenerateFileData } from "../type/shard";

export const typeGenerator = async ({
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

  console.log(
    chalk.blue(
      `\nGeneration types of ${baseFileName} from ${fileName} Complete! 🚀`,
    ),
  );
};

export const typeIndexGenerator = async ({
  fileName,
  srcDir,
}: {
  fileName: string;
  srcDir: string;
}) => {
  const typesDir = path.join(srcDir, `types`);
  const typesFullPath = path.join(typesDir, "index.ts");
  await fs.appendFile(typesFullPath, `export * from './${fileName}';\n`);
};
