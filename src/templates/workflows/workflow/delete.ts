// src/templates.ts
import { TemplateData } from "../../../type/shard";
import { toPascalCase, toCamelCase, toKebabCase } from "../../../utils";

// 2. GENERATE Delete STEPS
export const generateDeleteWorkflows = ({
  modelName,
  tableName,
}: TemplateData) => {
  const camelName = toCamelCase(modelName);

  return `
import { WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { createWorkflow } from "@medusajs/workflows-sdk";
import { ModuleDelete${modelName} } from  '../../../../types';
import { delete${modelName}sStep } from "../../steps";

export const delete${modelName}sWorkflow = createWorkflow(
  "delete-${toKebabCase(modelName)}",
  function (input: ModuleDelete${modelName}) {
    delete${modelName}sStep([input.id]);

    return new WorkflowResponse(undefined);
  },
);
`;
};

export default generateDeleteWorkflows;
