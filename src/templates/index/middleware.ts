export const generateIndexMiddleware = () => {
    return `export * from "./admin";
export * from "./store";`;
};

export default generateIndexMiddleware;
