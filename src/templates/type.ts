// src/templates.ts
import { toPascalCase, toCamelCase, toKebabCase } from "../utils";

interface TemplateData {
  modelName: string; // e.g. "Account"
  tableName: string; // e.g. "account"
}

// 1. GENERATE TYPES
export const generateTypes = ({ modelName, tableName }: TemplateData) => {
  return `import { ${modelName} } from "../models/${tableName}";
import { InferTypeOf } from "@medusajs/framework/types";

export type ${modelName} = InferTypeOf<typeof ${modelName}>;

export interface Create${modelName}DTO {
  // Add fields based on model definition if needed
  name: string;
}

export interface Update${modelName}DTO {
  id: string;
  name?: string;
}
`;
};

// 2. GENERATE STEPS
export const generateSteps = ({ modelName, tableName }: TemplateData) => {
  const camelName = toCamelCase(modelName);

  return `import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Create${modelName}DTO } from "../types/${tableName}";
import { ${modelName} } from "../models/${tableName}";
import { Modules } from "@medusajs/framework/utils";

export const create${modelName}Step = createStep(
  "create-${toKebabCase(modelName)}",
  async (input: Create${modelName}DTO, { container }) => {
    const service = container.resolve("myModuleService"); // Replace with your actual module name
    const ${camelName} = await service.create${modelName}s(input);
    return new StepResponse(${camelName}, ${camelName}.id);
  },
  async (id: string, { container }) => {
    const service = container.resolve("myModuleService");
    await service.delete${modelName}s([id]);
  }
);
`;
};

// 3. GENERATE WORKFLOW
export const generateWorkflow = ({ modelName, tableName }: TemplateData) => {
  const camelName = toCamelCase(modelName);

  return `import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { create${modelName}Step } from "../steps/create-${toKebabCase(
    modelName,
  )}";
import { Create${modelName}DTO } from "../types/${tableName}";

export const create${modelName}Workflow = createWorkflow(
  "create-${toKebabCase(modelName)}",
  (input: Create${modelName}DTO) => {
    const ${camelName} = create${modelName}Step(input);
    return new WorkflowResponse(${camelName});
  }
);
`;
};
