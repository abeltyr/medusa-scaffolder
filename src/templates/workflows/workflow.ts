// src/templates.ts
import { TemplateData } from "../../type/shard";
import { toPascalCase, toCamelCase, toKebabCase } from "../../utils";

// 2. GENERATE Create STEPS
export const generateCreateWorkflows = ({
  modelName,
  tableName,
}: TemplateData) => {
  const camelName = toCamelCase(modelName);

  return `
import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk";
import { ModuleCreate${modelName} } from  '../../../../types';
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
