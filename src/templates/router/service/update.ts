import { TemplateData } from "../../../type/shard";
import { toPascalCase, toCamelCase, toKebabCase, toSnakeCase } from "../../../utils";

export const generateUpdateService = ({ modelName, fileName }: TemplateData) => {
  const camelName = toCamelCase(modelName);


  return `
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { admin${modelName}Fields } from "../../../query";
import { update${modelName}sWorkflow } from "../../../../workflows/${fileName}";
import { AdminUpdate${modelName}Type } from "../../../validators";

export const ${camelName}UpdateService = async (
  req: AuthenticatedMedusaRequest<AdminUpdate${modelName}Type>,
  res: MedusaResponse,
) => {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const { ${camelName}Id } = req.params;

    await update${modelName}sWorkflow.run({
      input: { ...req.body, id: ${camelName}Id },
      container: req.scope,
    });

    let fields: string[] = admin${modelName}Fields;
    if (req.query && req.query.fields && typeof req.query.fields === "string") {
      fields = req.query.fields.split(",");
    }

    const {
      data: [${camelName}],
    } = await query.graph(
      {
        entity: "${toSnakeCase(modelName)}",
        fields,
        filters: { id: ${camelName}Id },
      },
      { throwIfKeyNotFound: true },
    );

    res.json({ status: 200, data: ${camelName} });
  } catch (e) {
    res.json({
      status: 500,
      error: e,
    });
  }
};
`;
};

export default generateUpdateService;
