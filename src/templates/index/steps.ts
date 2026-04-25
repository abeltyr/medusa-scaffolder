export const generateIndexSteps = () => {
  return `export * from "./create";
export * from "./update";
export * from "./delete";
`;
};

export default generateIndexSteps;
