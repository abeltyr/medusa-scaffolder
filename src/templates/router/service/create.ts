import { TemplateData } from "../../../type/shard";
import { toPascalCase, toCamelCase, toKebabCase, toSnakeCase } from "../../../utils";

export const generateCreateService = ({ modelName, fileName, tableName }: TemplateData) => {
  const camelName = toCamelCase(modelName);

  return `import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { admin${modelName}Fields } from "../../../query";
import { AdminCreate${modelName}Type } from "../../../validators";
import { create${modelName}sWorkflow } from "../../../../workflows/${fileName}";

export const ${camelName}CreateService = async (
  req: AuthenticatedMedusaRequest<
    AdminCreate${modelName}Type | AdminCreate${modelName}Type[]
  >,
  res: MedusaResponse,
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const { result: created${modelName}s } = await create${modelName}sWorkflow.run({
      input: {
        data: Array.isArray(req.body)
          ? req.body.map((${camelName}) => ({ ...${camelName} }))
          : [{ ...req.body }],
        userId: req.auth_context.actor_id,
      },
      container: req.scope,
    });

    try {
      const { data: ${camelName}s } = await query.graph(
        {
          entity: "${toSnakeCase(modelName)}",
          fields: admin${modelName}Fields,
          filters: {
            id: created${modelName}s.${camelName}s.map((${camelName}) => ${camelName}.id),
          },
        },
        { throwIfKeyNotFound: true },
      );

      res.json({
        status: 200,
        data: ${camelName}s?.[0],
      });
    } catch (e) {
      console.log(e);
      return res.json({
        status: 200,
        data: created${modelName}s,
      });
    }
  } catch (e) {
    res.json({
      status: 500,
      error: e,
    });
  }
};
`;
};

export default generateCreateService;
