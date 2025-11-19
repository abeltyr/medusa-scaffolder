// src/templates.ts
import { TemplateData } from "../../../type/shard";
import { toPascalCase, toCamelCase, toKebabCase } from "../../../utils";

// 2. GENERATE Update STEPS
export const generateUpdateWorkflows = ({
  modelName,
  tableName,
}: TemplateData) => {
  return `
import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk";
import { ModuleUpdate${modelName} } from "../../../../types";
import { update${modelName}Step } from "../../steps";

export const update${modelName}sWorkflow = createWorkflow(
  "update-${toKebabCase(modelName)}",
  function (input: ModuleUpdate${modelName}) {
    return new WorkflowResponse(update${modelName}Step(input));
  },
);
`;
};

export default generateUpdateWorkflows;
