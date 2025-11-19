import { TemplateData } from "../../type/shard";

// 1. GENERATE TYPES
export const generateModuleTypes = ({
  modelName,
  tableName,
  fileName,
}: TemplateData) => {
  return `
import { ${modelName}DTO } from "../../../modules/${fileName}/types/common";

export type Module${modelName} = ${modelName}DTO;

export type ModuleCreate${modelName} = Partial<Module${modelName}>;

export interface ModuleUpdate${modelName} extends Partial<Module${modelName}> {
  id: string;
}

export type ModuleDelete${modelName} = {
  id: string;
};
`;
};

export default generateModuleTypes;
