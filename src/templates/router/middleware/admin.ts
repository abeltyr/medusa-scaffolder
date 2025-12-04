import { TemplateData } from "../../../type/shard";
import { toCamelCase, toKebabCase, toSnakeCase } from "../../../utils";

export const generateAdminMiddleware = ({ modelName }: TemplateData) => {
  const snakeName = toSnakeCase(modelName);

  return `import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
import { MiddlewareRoute } from "@medusajs/medusa";
import { admin${modelName}sQueryConfig } from "../../../query";
import {
  AdminCreate${modelName},
  AdminGet${modelName}Params,
  AdminUpdate${modelName},
} from "../../../validators";

export const admin${modelName}sPathMiddlewares: MiddlewareRoute[] = [
  /* ${modelName}s Middlewares */
  {
    method: ["GET"],
    matcher: "/admin/${snakeName}s",
    middlewares: [
      validateAndTransformQuery(
        AdminGet${modelName}Params,
        admin${modelName}sQueryConfig.list,
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/${snakeName}s",
    middlewares: [
      validateAndTransformBody(AdminCreate${modelName}),
      validateAndTransformQuery(
        AdminGet${modelName}Params,
        admin${modelName}sQueryConfig.retrieve,
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/${snakeName}s/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGet${modelName}Params,
        admin${modelName}sQueryConfig.retrieve,
      ),
    ],
  },
  {
    method: ["PUT"],
    matcher: "/admin/${snakeName}s/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdate${modelName}),
      validateAndTransformQuery(
        AdminGet${modelName}Params,
        admin${modelName}sQueryConfig.retrieve,
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/${snakeName}s/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGet${modelName}Params,
        admin${modelName}sQueryConfig.delete,
      ),
    ],
  },
];
`;
};

export default generateAdminMiddleware;
