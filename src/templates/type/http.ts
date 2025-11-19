import { TemplateData } from "../../type/shard";

// 1. GENERATE TYPES
export const generateHttpTypes = ({
  modelName,
  tableName,
  fileName,
}: TemplateData) => {
  return `
import { FindParams, PaginatedResponse } from "@medusajs/types";
import { Query${modelName} } from "../query";
import { Module${modelName}Filters } from "../service";
import { ModuleCreate${modelName}, ModuleUpdate${modelName} } from "../module";
import { MedusaError } from "@medusajs/framework/utils";

/* Filters */

export interface ${modelName}FilterParams extends FindParams, Module${modelName}Filters {}
/* Admin */

/* ${modelName} */
export type Admin${modelName}Response = {
  status: number;
  data: Query${modelName};
  error?: MedusaError;
};

export type Admin${modelName}sResponse = PaginatedResponse<{
  workspace${modelName}s: Query${modelName}[];
}>;

export type AdminCreate${modelName} = ModuleCreate${modelName};

export type AdminUpdate${modelName} = ModuleUpdate${modelName};

/* Store */

/* ${modelName} */

export type Store${modelName}Response = {
  status: number;
  data: Query${modelName};
  error?: MedusaError;
};

export type Store${modelName}sResponse = PaginatedResponse<{
  workspace${modelName}s: Query${modelName}[];
}>;

export type Store${modelName}PreviewResponse = {
  status: number;
  data: Query${modelName};
  error?: MedusaError;
};
`;
};

export default generateHttpTypes;
