// src/templates.ts
import { TemplateData } from "../../../type/shard";
import { toPascalCase, toCamelCase, toKebabCase, toSnakeCase } from "../../../utils";

// 2. GENERATE Delete STEPS
export const generateDeleteWorkflows = ({
  modelName,
  tableName,
  fileName
}: TemplateData) => {
  const snakeCase = toSnakeCase(modelName);

  return `import { WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { createWorkflow } from "@medusajs/framework/workflows-sdk";
import { ModuleDelete${modelName} } from "../../../../types";
import { removeRemoteLinkStep } from '@medusajs/medusa/core-flows';
import { delete${modelName}sStep } from "../../steps";
import { ${fileName.toUpperCase()}_MODULE } from '../../../../modules/${fileName}'

export const delete${modelName}sWorkflow = createWorkflow(
  "delete-${toKebabCase(modelName)}",
  function (input: ModuleDelete${modelName}) {
    delete${modelName}sStep([input.id]);

    removeRemoteLinkStep({
      [${fileName.toUpperCase()}_MODULE]: { ${snakeCase}_id: input.id },
    })
            
    return new WorkflowResponse(undefined);
  },
);
`;
};

export default generateDeleteWorkflows;
