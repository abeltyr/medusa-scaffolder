import {
    VariableDeclaration,
    SyntaxKind,
    CallExpression,
    ObjectLiteralExpression,
    PropertyAssignment
} from "ts-morph";

// Helper interface for our extraction result
interface FieldDefinition {
    name: string;
    medusaType: string;
    isNullable: boolean;
    enumOptions?: string[];
    isRelationship: boolean; // To filter out hasMany/belongsTo if needed
}

export function extractMedusaModelInfo(targetDecl: VariableDeclaration) {
    // 1. Get the 'model.define(...)' call
    const initializer = targetDecl.getInitializerIfKind(SyntaxKind.CallExpression);
    if (!initializer) return;

    // 2. Get the second argument: the object literal { id: ..., name: ... }
    const schemaArg = initializer.getArguments()[1];
    if (!schemaArg || !ObjectLiteralExpression.isObjectLiteralExpression(schemaArg)) {
        console.error("Could not find schema object definition");
        return;
    }

    const fields: FieldDefinition[] = [];

    // 3. Iterate over properties (id, name, email, etc.)
    schemaArg.getProperties().forEach((prop) => {
        if (!prop.isKind(SyntaxKind.PropertyAssignment)) return;

        const fieldName = prop.getName();
        const expression = prop.getInitializer(); // e.g., model.text().searchable()

        if (CallExpression.isCallExpression(expression)) {
            const info = parseMedusaChain(expression);
            fields.push({ name: fieldName, ...info });
        }
    });

    // 4. Generate Code
    return generateOutput(targetDecl.getName(), fields);
}

// Helper: Recursively unwinds 'model.text().nullable()'
function parseMedusaChain(expression: CallExpression): Omit<FieldDefinition, 'name'> {
    let currentExpr: any = expression;
    let medusaType = "unknown";
    let isNullable = false;
    let enumOptions: string[] | undefined = undefined;
    let isRelationship = false;

    // We traverse "down" the left side of the chain: 
    // .searchable() -> .text() -> model
    while (CallExpression.isCallExpression(currentExpr)) {

        // 1. Get the expression being called. 
        // In `model.text()`, this gets `model.text`
        const exprToCheck = currentExpr.getExpression();

        // 2. Safely cast to PropertyAccessExpression
        // This allows us to access .getName() and .getExpression()
        const propAccess = exprToCheck.asKind(SyntaxKind.PropertyAccessExpression);

        if (propAccess) {
            const methodName = propAccess.getName(); // "nullable", "text", "enum", etc.

            // --- Logic Checks ---
            if (methodName === "nullable") isNullable = true;

            if (["text", "id", "json", "enum", "hasMany", "hasOne", "belongsTo"].includes(methodName)) {
                medusaType = methodName;

                if (["hasMany", "hasOne", "belongsTo"].includes(methodName)) {
                    isRelationship = true;
                }

                // Extract Enum values if applicable
                if (methodName === "enum") {
                    const args = currentExpr.getArguments();
                    if (args.length > 0) {
                        // Safely cast argument to ArrayLiteralExpression to get elements
                        const arrayLiteral = args[0].asKind(SyntaxKind.ArrayLiteralExpression);
                        if (arrayLiteral) {
                            enumOptions = arrayLiteral.getElements().map(e => e.getText().replace(/['"]/g, ''));
                        }
                    }
                }
            }
            // --------------------

            // 3. Move down the chain. 
            // In `model.text`, getExpression() returns `model`
            currentExpr = propAccess.getExpression();
        } else {
            // We reached the 'model' identifier or something that isn't a property access
            break;
        }
    }

    return { medusaType, isNullable, enumOptions, isRelationship };
}

// Helper: Create Zod and TS strings
function generateOutput(modelName: string, fields: FieldDefinition[]) {
    let zodLines: string[] = [];
    let typeLines: string[] = [];

    fields.forEach(field => {
        // Skip relationships for simple DTOs (optional preference)
        if (field.isRelationship) return;

        let zodType = "z.any()";
        let tsType = "any";

        switch (field.medusaType) {
            case "text":
            case "id":
                zodType = "z.string()";
                tsType = "string";
                break;
            case "json":
                zodType = "z.record(z.string(), z.unknown())";
                tsType = "Record<string, unknown>";
                break;
            case "enum":
                if (field.enumOptions) {
                    // z.enum(["A", "B"])
                    const options = field.enumOptions.map(o => `"${o}"`).join(", ");
                    zodType = `z.enum([${options}])`;
                    tsType = field.enumOptions.map(o => `"${o}"`).join(" | ");
                } else {
                    zodType = "z.string()";
                    tsType = "string";
                }
                break;
        }

        // Handle Nullable
        if (field.isNullable) {
            zodType += ".nullable()";
            tsType += " | null";
        }

        zodLines.push(`  ${field.name}: ${zodType},`);
        typeLines.push(`  ${field.name}: ${tsType};`);
    });

    return `
import { z } from "zod";

export const ${modelName}Schema = z.object({
${zodLines.join("\n")}
});

export type ${modelName}DTO = {
${typeLines.join("\n")}
};
`;
}