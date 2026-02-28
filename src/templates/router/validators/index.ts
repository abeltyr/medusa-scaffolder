import { TemplateData } from "../../../type/shard";
import { toPascalCase } from "../../../utils";

export const generateValidators = ({ modelName }: TemplateData) => {
    const Name = toPascalCase(modelName);

    return `import { z } from "zod";
import { createFindParams, createSelectParams } from "@medusajs/medusa/api/utils/validators";

export const AdminGet${Name}Params = createSelectParams();
export type AdminGet${Name}ParamsType = z.infer<typeof AdminGet${Name}Params>;

export const AdminCreate${Name} = z.object({
  // Add your creation fields here
}).strict();
export type AdminCreate${Name}Type = z.infer<typeof AdminCreate${Name}>;

export const AdminUpdate${Name} = z.object({
  // Add your update fields here
}).strict();
export type AdminUpdate${Name}Type = z.infer<typeof AdminUpdate${Name}>;
`;
};

export default generateValidators;
