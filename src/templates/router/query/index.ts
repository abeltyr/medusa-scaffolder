import { TemplateData } from "../../../type/shard";
import { toPascalCase } from "../../../utils";

export const generateQuery = ({ modelName }: TemplateData) => {
    const Name = toPascalCase(modelName);

    return `export const admin${Name}Fields = [
  "id",
  "created_at",
  "updated_at",
  // Add specific fields here
];

export const admin${Name}sQueryConfig = {
  list: {
    defaults: admin${Name}Fields,
    isList: true,
  },
  retrieve: {
    defaults: admin${Name}Fields,
    isList: false,
  },
  delete: {
    defaults: ["id", "deleted_at"],
    isList: false,
  },
};
`;
};

export default generateQuery;
