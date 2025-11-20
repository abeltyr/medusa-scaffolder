import { TemplateData } from "../../../type/shard";
import { toPascalCase, toCamelCase, toSnakeCase } from "../../../utils";

export const generateGetService = ({ modelName }: TemplateData) => {
  const camelName = toCamelCase(modelName);
  return `
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { admin${modelName}Fields } from "../../../query";

import { AdminGet${modelName}ParamsType } from "../../../validators";

export const ${camelName}GetService = async (
  req: AuthenticatedMedusaRequest<AdminGet${modelName}ParamsType>,
  res: MedusaResponse,
) => {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const { ${camelName}Id } = req.params;

    let fields: string[] = admin${modelName}Fields;
    if (req.query && req.query.fields && typeof req.query.fields === "string") {
      fields = req.query.fields.split(",");
    }

    const { data: ${camelName}s } = await query.graph(
      {
        entity: "${toSnakeCase(modelName)}",
        fields,
        filters: { id: ${camelName}Id },
      },
      { throwIfKeyNotFound: true },
    );

    res.json({
      status: 200,
      data: ${camelName}s[0],
    });
  } catch (e) {
    res.json({
      status: 500,
      error: e,
    });
  }
};
`;
};

export default generateGetService;
