export const generateIndexTypes = () => {
  return `export * from "./http";
export * from "./module";
export * from "./query";
export * from "./service";
`;
};

export default generateIndexTypes;
