import { TemplateData } from "../../../type/shard";
import { toPascalCase, toCamelCase, toKebabCase } from "../../../utils";

export const generateDeleteService = ({ modelName, fileName }: TemplateData) => {
  const camelName = toCamelCase(modelName);


  return `
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { delete${modelName}sWorkflow } from "../../../../workflows/${fileName}";

export const ${camelName}DeleteService = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) => {
  const { ${camelName}Id } = req.params;
  try {
    const { result } = await delete${modelName}sWorkflow.run({
      input: {
        id: ${camelName}Id,
      },
    });
    res.json({
      status: 200,
      data: {
        id: ${camelName}Id,
        object: "${camelName}",
        deleted: true,
      },
    });
  } catch (e) {
    res.json({
      status: 500,
      error: e,
      data: {
        id: ${camelName}Id,
        object: "${camelName}",
        deleted: false,
      },
    });
  }
};
`;
};

export default generateDeleteService;
