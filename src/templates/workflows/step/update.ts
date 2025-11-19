// src/templates.ts
import { TemplateData } from "../../../type/shard";
import { toPascalCase, toCamelCase, toKebabCase } from "../../../utils";

// 2. GENERATE Update STEPS
export const generateUpdateSteps = ({
  modelName,
  tableName,
  fileName,
}: TemplateData) => {
  const camelName = toCamelCase(modelName);

  return `
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ${fileName.toUpperCase()}_MODULE } from "../../../../modules/${fileName}";
import { I${modelName}ModuleService, ModuleUpdate${modelName} } from "../../../../types";

export const update${modelName}Step = createStep(
  "update-${toKebabCase(modelName)}",
  async (input: ModuleUpdate${modelName}, { container }) => {
    const ${camelName}ModuleService =
      container.resolve<I${modelName}ModuleService>(${fileName.toUpperCase()}_MODULE);

    const [previousData] = await ${camelName}ModuleService.list${modelName}s({
      id: input.id,
    });

    const updated${modelName} = await ${camelName}ModuleService.update${modelName}s([input]);

    return new StepResponse(updated${modelName}, previousData);
  },
  async (previousData: ModuleUpdate${modelName}, { container }) => {
    const ${camelName}ModuleService =
      container.resolve<I${modelName}ModuleService>(${fileName.toUpperCase()}_MODULE);

    await ${camelName}ModuleService.update${modelName}s([previousData]);
  },
);
`;
};

export default generateUpdateSteps;
