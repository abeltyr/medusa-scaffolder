import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import { GenerateFileData } from "../type/shard";
import generateQuery from '../templates/router/query';

export const queryGenerator = async ({
    baseFileName,
    modelName,
    tableName,
    fileName,
    srcDir,
    start,
    updateState,
}: GenerateFileData) => {
    const data = { modelName, tableName, fileName };

    const outputFiles = [
        {
            type: "generateQuery",
            dir: path.join(srcDir, `router/query/${fileName}`),
            file: `${baseFileName}.ts`,
            content: generateQuery(data),
            shouldIndex: true,
        }
    ];

    for (const item of outputFiles) {
        const fullPath = path.join(item.dir, item.file);
        await fs.ensureDir(item.dir);
        await fs.writeFile(fullPath, item.content);
        console.log(chalk.white(`Created ${item.type}: ${chalk.gray(fullPath)}`));

        if (item.shouldIndex) {
            const indexPath = path.join(item.dir, "index.ts");
            if (start) {
                await fs.writeFile(
                    indexPath,
                    `export * from './${item.file.replace(".ts", "")}';\n`,
                );
                updateState(false);
            } else {
                await fs.appendFile(
                    indexPath,
                    `export * from './${item.file.replace(".ts", "")}';\n`,
                );
            }
        }
    }

    const workflowDir = path.join(srcDir, `router/query/${fileName}`);
    const workflowFullPath = path.join(workflowDir, "index.ts");
    await fs.appendFile(workflowFullPath, `export * from './${baseFileName}';\n`);

    console.log(
        chalk.blue(
            `\nGeneration Query ${baseFileName} from ${fileName} Complete! 🚀`,
        ),
    );
};
