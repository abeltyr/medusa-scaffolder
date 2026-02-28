import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import { GenerateFileData } from "../type/shard";
import generateApi from '../templates/router/api';

export const apiGenerator = async ({
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
            type: "generateApiRoute",
            dir: path.join(srcDir, `api/admin/${fileName}/${baseFileName}s`),
            file: `route.ts`,
            content: generateApi(data),
            shouldIndex: false,
        },
        {
            type: "generateApiRouteId",
            dir: path.join(srcDir, `api/admin/${fileName}/${baseFileName}s/[id]`),
            file: `route.ts`,
            content: generateApi(data, true),
            shouldIndex: false,
        },
        {
            type: "generateApiStoreRoute",
            dir: path.join(srcDir, `api/store/${fileName}/${baseFileName}s`),
            file: `route.ts`,
            content: generateApi(data),
            shouldIndex: false,
        },
        {
            type: "generateApiStoreRouteId",
            dir: path.join(srcDir, `api/store/${fileName}/${baseFileName}s/[id]`),
            file: `route.ts`,
            content: generateApi(data, true),
            shouldIndex: false,
        }
    ];

    for (const item of outputFiles) {
        const fullPath = path.join(item.dir, item.file);
        await fs.ensureDir(item.dir);
        await fs.writeFile(fullPath, item.content);
        console.log(chalk.white(`Created ${item.type}: ${chalk.gray(fullPath)}`));
    }

    console.log(
        chalk.blue(
            `\nGeneration API ${baseFileName} from ${fileName} Complete! 🚀`,
        ),
    );
};
