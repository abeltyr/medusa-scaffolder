import { TemplateData } from "../../../type/shard";
import { toPascalCase, toCamelCase, toSnakeCase } from "../../../utils";

export const generateGetAllService = ({ modelName }: TemplateData) => {
  const camelName = toCamelCase(modelName);


  return `
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { admin${modelName}Fields } from "../../../query";
import {
  extractFilters,
  extractFiltersJson,
  paginationGenerator,
} from "../../../../utils/pagination";

export const ${camelName}GetAllService = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  let fields: string[] = admin${modelName}Fields;

  let filters: any = {};

  let pagination: {
    order?: Record<string, string> | undefined;
    skip: number;
    take?: number;
  } = paginationGenerator({
    query: req.query as { [key: string]: string },
    defaultOrder: {
      direction: "DESC",
      order: "created_at",
    },
  });

  if (req.query && req.query.fields && typeof req.query.fields === "string") {
    fields = req.query.fields.split(",");
  }

  if (
    req.query.filterableFields &&
    typeof req.query.filterableFields === "string"
  ) {
    {
      const filterData = extractFilters({
        allowedFields: ["is_active", "slug", "name"],
        query: req.query.filterableFields as string,
      });
      if (filterData && Object.keys(filterData).length > 0)
        filters = { ...filters, ...filterData };
    }
  }
  if (req.query.q) {
    filters = {
      q: req.query.q,
    };
  }

  if (req.query.created_at && typeof req.query.created_at === "string") {
    const value = extractFiltersJson(req.query.created_at);
    if (value) filters.created_at = value;
  }

  const { data: ${camelName}s, metadata } = await query.graph({
    entity: "${toSnakeCase(modelName)}",
    fields: fields,
    filters,
    pagination,
  });

  res.json({
    ${camelName}s,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  });
};
`;
};

export default generateGetAllService;
