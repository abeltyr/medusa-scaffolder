import { TemplateData } from "../../../type/shard";
import { toPascalCase, toCamelCase, toKebabCase, toSnakeCase } from "../../../utils";

export const generateStoreMiddleware = ({ modelName }: TemplateData) => {
  const camelName = toCamelCase(modelName);
  const kebabName = toKebabCase(modelName);
  const snakeName = toSnakeCase(modelName);
  const constantName = snakeName?.toUpperCase();

  return `
import { authenticate } from "@medusajs/framework";
import { MiddlewareRoute } from "@medusajs/medusa";

export const stroe${modelName}sPathMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/stroe/${snakeName}s",
    middlewares: [],
  },
  {
    method: ["GET"],
    matcher: "/stroe/${snakeName}s/:id",
    middlewares: [],
  },

  {
    method: ["POST"],
    matcher: "/stroe/${snakeName}s",
    middlewares: [],
  },
  {
    method: ["PUT"],
    matcher: "/stroe/${snakeName}s/:id",
    middlewares: [],
  },
];
`;
};

export default generateStoreMiddleware;
