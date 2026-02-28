import { TemplateData } from "../../../type/shard";
import { toCamelCase, toSnakeCase } from "../../../utils";

export const generateApi = ({ modelName, fileName }: TemplateData, idRoute = false) => {
    const camelName = toCamelCase(modelName);

    if (idRoute) {
        return `import {
  ${fileName}${modelName}DeleteService,
  ${fileName}${modelName}GetService,
  ${fileName}${modelName}UpdateService,
} from "../../../router/service/${fileName}/${modelName}";

export const GET = ${fileName}${modelName}GetService;
export const PUT = ${fileName}${modelName}UpdateService;
export const DELETE = ${fileName}${modelName}DeleteService;
`;
    }

    return `import {
  ${fileName}${modelName}CreateService,
  ${fileName}${modelName}GetAllService,
} from "../../../router/service/${fileName}/${modelName}";

export const GET = ${fileName}${modelName}GetAllService;
export const POST = ${fileName}${modelName}CreateService;
`;
};

export default generateApi;
