// src/templates.ts
import { TemplateData } from "../../../type/shard";
import { toPascalCase, toCamelCase, toKebabCase } from "../../../utils";

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
export default generateDeleteSteps;
