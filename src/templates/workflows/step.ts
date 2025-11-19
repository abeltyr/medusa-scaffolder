// src/templates.ts
import { TemplateData } from "../../type/shard";
import { toPascalCase, toCamelCase, toKebabCase } from "../../utils";

// 2. GENERATE Create STEPS
export const generateCreateSteps = ({ modelName, tableName }: TemplateData) => {
  const camelName = toCamelCase(modelName);

  return `
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ${tableName.toUpperCase()}_MODULE } from "../models/${tableName}";
import { I${modelName}ModuleService, ModuleCreate${modelName} } from "../../../../types";

export const create${modelName}sStep = createStep(
  "create-${toKebabCase(modelName)}s",
  async (input: ModuleCreate${modelName}[], { container }) => {
    const ${camelName}ModuleService =
      container.resolve<I${modelName}ModuleService>(ACCOUNT_MODULE);

    const ${camelName}s = await ${camelName}ModuleService.create${modelName}s(input);

    return new StepResponse(
      ${camelName}s,
      ${camelName}s.map((${camelName}) => ${camelName}.id),
    );
  },
  async (${camelName}Ids: string[], { container }) => {
    if (!${camelName}Ids) {
      return;
    }

    const ${camelName}ModuleService =
      container.resolve<I${modelName}ModuleService>(ACCOUNT_MODULE);

    await ${camelName}ModuleService.delete${modelName}s(${camelName}Ids);
  },
);
`;
};

// 2. GENERATE Delete STEPS
export const generateDeleteSteps = ({ modelName, tableName }: TemplateData) => {
  const camelName = toCamelCase(modelName);

  return `
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ${tableName.toUpperCase()}_MODULE } from "../models/${tableName}";
import { I${modelName}ModuleService } from "../../../../types";


export const delete${modelName}sStep = createStep(
  "delete-${toKebabCase(modelName)}",
  async (ids: string[], { container }) => {
    const ${camelName}Module =
      container.resolve<I${modelName}ModuleService>(ACCOUNT_MODULE);

    await ${camelName}Module.softDelete${modelName}s(ids);

    return new StepResponse(ids, ids);
  },
  async (${camelName}Ids: string[], { container }) => {
    const ${camelName}Module =
      container.resolve<I${modelName}ModuleService>(ACCOUNT_MODULE);

    await ${camelName}Module.restore${modelName}s(${camelName}Ids);
  },
);
`;
};

// 2. GENERATE Update STEPS
export const generateUpdateSteps = ({ modelName, tableName }: TemplateData) => {
  const camelName = toCamelCase(modelName);

  return `
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ${tableName.toUpperCase()}_MODULE } from "../models/${tableName}";
import { I${modelName}ModuleService, ModuleUpdate${modelName} } from "../../../../types";

export const update${modelName}Step = createStep(
  "update-${toKebabCase(modelName)}",
  async (input: ModuleUpdate${modelName}, { container }) => {
    const ${camelName}ModuleService =
      container.resolve<I${modelName}ModuleService>(ACCOUNT_MODULE);

    const [previousData] = await ${camelName}ModuleService.list${modelName}s({
      id: input.id,
    });

    const updated${modelName} = await ${camelName}ModuleService.update${modelName}s([input]);

    return new StepResponse(updated${modelName}, previousData);
  },
  async (previousData: ModuleUpdate${modelName}, { container }) => {
    const ${camelName}ModuleService =
      container.resolve<I${modelName}ModuleService>(ACCOUNT_MODULE);

    await ${camelName}ModuleService.update${modelName}s([previousData]);
  },
);
`;
};
