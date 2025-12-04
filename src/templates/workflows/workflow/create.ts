// src/templates.ts
import { TemplateData } from "../../../type/shard";
import { toPascalCase, toCamelCase, toKebabCase } from "../../../utils";

// 2. GENERATE Create STEPS
export const generateCreateWorkflows = ({
  modelName,
  tableName,
}: TemplateData) => {
  const camelName = toCamelCase(modelName);

  return `import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk";
import { ModuleCreate${modelName} } from "../../../../types";
import { create${modelName}sStep } from "../../steps";

export const create${modelName}sWorkflow = createWorkflow(
  "create-${toKebabCase(modelName)}",
  function (input: { data: ModuleCreate${modelName}[] }) {
    const ${camelName}s = create${modelName}sStep(input.data);

    return new WorkflowResponse({ ${camelName}s });
  },
);
`;
};

export default generateCreateWorkflows;
