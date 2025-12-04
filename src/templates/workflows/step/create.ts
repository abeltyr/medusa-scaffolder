// src/templates.ts
import { TemplateData } from "../../../type/shard";
import { toPascalCase, toCamelCase, toKebabCase } from "../../../utils";

// 2. GENERATE Create STEPS
export const generateCreateSteps = ({
  modelName,
  tableName,
  fileName,
}: TemplateData) => {
  const camelName = toCamelCase(modelName);

  return `import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ${fileName.toUpperCase()}_MODULE } from "../../../../modules/${fileName}";
import { I${modelName}ModuleService, ModuleCreate${modelName} } from "../../../../types";

export const create${modelName}sStep = createStep(
  "create-${toKebabCase(modelName)}s",
  async (input: ModuleCreate${modelName}[], { container }) => {
    const ${camelName}ModuleService =
      container.resolve<I${modelName}ModuleService>(${fileName.toUpperCase()}_MODULE);

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
      container.resolve<I${modelName}ModuleService>(${fileName.toUpperCase()}_MODULE);

    await ${camelName}ModuleService.delete${modelName}s(${camelName}Ids);
  },
);
`;
};

export default generateCreateSteps;
