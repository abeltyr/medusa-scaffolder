// src/templates.ts
import { TemplateData } from "../../../type/shard";
import { toPascalCase, toCamelCase, toKebabCase } from "../../../utils";

// 2. GENERATE Unlink STEPS
export const generateUnlinkSteps = ({
  modelName,
  tableName,
  fileName,
}: TemplateData) => {
  const camelName = toCamelCase(modelName);
  const pascalName = toPascalCase(modelName);

  return `import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { ${fileName.toUpperCase()}_MODULE } from '../../../../modules/${fileName}'

type Delete${modelName}LinksStepInput = {
    id: string
}

export const delete${modelName}LinksStep = createStep(
    "delete-${toKebabCase(modelName)}-links",
    async ({ id }: Delete${modelName}LinksStepInput, { container }) => {
        const link = container.resolve(ContainerRegistrationKeys.LINK)

        await link.delete({
            [${fileName.toUpperCase()}_MODULE]: { ${pascalName}_id: id },
        })

        return new StepResponse(null)
    }
);`;
};

export default generateUnlinkSteps;
