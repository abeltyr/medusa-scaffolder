import { TemplateData } from "../../type/shard";

// 1. GENERATE TYPES
export const generateQueryTypes = ({
  modelName,
  tableName,
  fileName,
}: TemplateData) => {
  return `import { Module${modelName} } from "../module";

export type Query${modelName} = Module${modelName};
  `;
};

export default generateQueryTypes;
