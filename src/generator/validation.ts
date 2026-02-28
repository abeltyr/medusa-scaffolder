import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import { GenerateFileData } from "../type/shard";
import generateValidators from '../templates/router/validators';

export const validationGenerator = async ({
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
            type: "generateValidators",
            dir: path.join(srcDir, `router/validators/${fileName}`),
            file: `${baseFileName}.ts`,
            content: generateValidators(data),
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

    const workflowDir = path.join(srcDir, `router/validators/${fileName}`);
    const workflowFullPath = path.join(workflowDir, "index.ts");
    await fs.appendFile(workflowFullPath, `export * from './${baseFileName}';\n`);

    console.log(
        chalk.blue(
            `\nGeneration Validators ${baseFileName} from ${fileName} Complete! 🚀`,
        ),
    );
};
