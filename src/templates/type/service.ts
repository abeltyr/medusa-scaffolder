import { TemplateData } from "../../type/shard";

// 1. GENERATE TYPES
export const generateServiceTypes = ({
  modelName,
  tableName,
  fileName,
}: TemplateData) => {
  return `
import {
  BaseFilterable,
  Context,
  FindConfig,
  IModuleService,
  RestoreReturn,
} from "@medusajs/types";
import {
  Module${modelName},
  ModuleCreate${modelName},
  ModuleUpdate${modelName},
} from "../module";

export interface Module${modelName}Filters
  extends BaseFilterable<Module${modelName}Filters> {
  q?: string;
  id?: string | string[];
  filterableFields?: string;
  created_at?: Date | Date[] | string | string[];
  updated_at?: Date | Date[] | string | string[];
}

/**
 * The main service interface for the ${modelName} Module.
 */
export interface I${modelName}ModuleService extends IModuleService {
  /* Entity: ${modelName}s */
  create${modelName}(
    data: ModuleCreate${modelName},
    sharedContext?: Context,
  ): Promise<Module${modelName}>;

  create${modelName}s(
    data: ModuleCreate${modelName}[],
    sharedContext?: Context,
  ): Promise<Module${modelName}[]>;

  retrieve${modelName}(
    id: string,
    config?: FindConfig<Module${modelName}>,
    sharedContext?: Context,
  ): Promise<Module${modelName}>;

  update${modelName}(
    data: ModuleUpdate${modelName},
    sharedContext?: Context,
  ): Promise<Module${modelName}>;

  update${modelName}s(
    data: ModuleUpdate${modelName}[],
    sharedContext?: Context,
  ): Promise<Module${modelName}[]>;

  list${modelName}s(
    filters?: Module${modelName}Filters,
    config?: FindConfig<Module${modelName}>,
    sharedContext?: Context,
  ): Promise<Module${modelName}[]>;

  delete${modelName}s(ids: string[], sharedContext?: Context): Promise<void>;

  softDelete${modelName}s(ids: string[], sharedContext?: Context): Promise<void>;

  restore${modelName}s<TReturnableLinkableKeys extends string = string>(
    ids: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context,
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>;

  /**
   * 
   * @param data - The ${modelName} to upsert.
   * @param sharedContext - The shared context.
   * @returns The upsert ${modelName}.
   */
    upsert${modelName}(
      data: Partial<ModuleCreate${modelName}>,
      sharedContext?: Context,
    ): Promise<{
      result: Module${modelName}[];
      originalRecords: Module${modelName}[];
      newRecordIds: string[];
    }>;

  compensateUpsert(
    compensationData: {
      originalRecords: ModuleUpdate${modelName}[];
      newRecordIds: string[];
      type: string;
    },
    sharedContext?: Context,
  ): Promise<void>;    
}
`;
};
