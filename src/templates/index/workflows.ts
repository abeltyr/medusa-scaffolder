export const generateIndexWorkflows = () => {
  return `
export * from "./create";
export * from "./update";
export * from "./delete";
`;
};

export default generateIndexWorkflows;
