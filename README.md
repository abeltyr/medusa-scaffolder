# Medusa Scaffolder

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![Bun](https://img.shields.io/badge/bun-%3E%3D1.0.0-orange.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

**A powerful CLI tool designed to accelerate MedusaJS development by automating the generation of essential code artifacts.**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [CLI Usage](#-cli-usage)
- [Generated Output](#-generated-output)
- [Examples](#-examples)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🌟 Overview

**Medusa Scaffolder** (`medusa-scaffolder`) is a code generation utility that analyzes your MedusaJS data models and automatically creates the corresponding:

- **TypeScript Type Definitions**
- **Workflow Definitions & Steps**
- **Service Layer Functions**
- **API Middleware**

By automating repetitive boilerplate code generation, it ensures consistency across your codebase and significantly speeds up development.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔷 **Type Generation** | Automatically creates TypeScript interfaces for HTTP responses, modules, queries, and services based on your Medusa models |
| ⚡ **Workflow Generation** | Scaffolds complete workflow definitions including `create`, `update`, `delete`, and `unlink` steps |
| 🛠 **Service Generation** | Generates full CRUD service layer (create, read, update, delete, getAll) |
| 🔐 **Middleware Generation** | Creates admin and store middleware structures |
| 📦 **Modular Architecture** | Generate specific artifacts individually or all at once |
| 🎯 **Smart Parsing** | Uses `ts-morph` for intelligent TypeScript AST parsing |
| 🗂 **Auto-indexing** | Automatically creates and updates `index.ts` barrel files |

---

## ⚙️ Prerequisites

Before using this tool, ensure you have:

- **[Bun](https://bun.sh)** `v1.0.0` or higher (recommended runtime)
- **[Node.js](https://nodejs.org)** `v18.0.0` or higher
- **TypeScript** `v5.0` or higher
- A **MedusaJS** project with models following the standard convention:
  ```
  export const ModelName = model.define("table_name", { ... })
  ```

---

## 📦 Installation

### Option 1: Clone and Build (Recommended)

```bash
# 1. Clone the repository
git clone <repository-url>
cd medusa-scaffolder

# 2. Install dependencies
bun install

# 3. Build and link the CLI globally
bun run build
```

The `bun run build` command will:
- Compile TypeScript to JavaScript (`bunx tsc`)
- Make the output executable (`chmod +x dist/index.js`)
- Link the `medusa-gen` command globally (`bun link`)

### Option 2: NPM Link (Alternative)

```bash
npm install
npm run build
npm link
```

### Verify Installation

```bash
medusa-gen --help
```

You should see the help output with available commands and options.

---

## 📁 Project Structure

```
medusa-scaffolder/
├── src/
│   ├── index.ts              # Main CLI entry point (Commander.js setup)
│   ├── extractor/            # Model parsing & metadata extraction
│   │   ├── getAllFiles.ts    # Utility to get all model files
│   │   ├── name.ts           # Extracts model name and table name
│   │   ├── source.ts         # Creates ts-morph SourceFile
│   │   └── data.ts           # Data extraction utilities
│   ├── generator/            # Code generation logic
│   │   ├── type.ts           # Type file generator
│   │   ├── workflow.ts       # Workflow & steps generator
│   │   ├── services.ts       # Service layer generator
│   │   └── middleware.ts     # Middleware generator
│   ├── templates/            # Code templates
│   │   ├── type/             # Type templates (http, module, query, service)
│   │   ├── workflows/        # Workflow templates (steps, workflows)
│   │   ├── router/           # Router templates (service, middleware)
│   │   └── index/            # Index file templates
│   ├── type/                 # Shared TypeScript interfaces
│   └── utils/                # Utility functions
├── dist/                     # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

---

## 💻 CLI Usage

The tool exposes a CLI command named `medusa-gen`.

### Syntax

```bash
medusa-gen <ModuleName> [options]
```

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<ModuleName>` | ✅ Yes | Name of the module directory containing your models. The tool looks in `src/modules/<ModuleName>/models/` |

### Options

| Flag | Short | Description |
|------|-------|-------------|
| `--all` | | **Recommended.** Generate all artifacts (Types, Workflows, Services, Middleware) |
| `--type` | | Generate only Type files |
| `--workflow` | | Generate only Workflow files |
| `--service` | | Generate only Service files |
| `--middleware` | | Generate only Middleware files |
| `--output <dir>` | `-o` | Specify output root directory (default: `src/modules`) |
| `--help` | `-h` | Display help information |
| `--version` | `-V` | Display version number |

### Model Requirements

Your models must follow the MedusaJS convention:

```typescript
// src/modules/your-module/models/your-model.ts
import { model } from "@medusajs/framework/utils";

export const YourModel = model.define("your_model", {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  // ... other fields
}).indexes([
  // optional indexes
]);
```

The scaffolder parses:
- **Model Name**: From the exported const name (e.g., `YourModel`)
- **Table Name**: From the first argument to `.define()` (e.g., `"your_model"`)

---

## 📂 Generated Output

When you run `medusa-gen <module> --all`, the following structure is created:

### Types (`src/types/<module>/`)

```
src/types/<module>/
├── index.ts
├── http/
│   ├── index.ts
│   └── <model>.ts          # Admin/Store response types, filter types
├── module/
│   ├── index.ts
│   └── <model>.ts          # Create/Update module types
├── query/
│   ├── index.ts
│   └── <model>.ts          # Query types
└── service/
    ├── index.ts
    └── <model>.ts          # Service filter types
```

### Workflows (`src/workflows/<module>/`)

```
src/workflows/<module>/
├── index.ts
├── steps/
│   ├── index.ts
│   └── <model>/
│       ├── index.ts
│       ├── create.ts       # Create step
│       ├── update.ts       # Update step
│       ├── delete.ts       # Delete step
│       └── unlink.ts       # Unlink step
└── workflows/
    ├── index.ts
    └── <model>/
        ├── index.ts
        ├── create.ts       # Create workflow
        ├── update.ts       # Update workflow
        └── delete.ts       # Delete workflow
```

### Services (`src/router/service/<module>/`)

```
src/router/service/<module>/
├── index.ts
└── <model>/
    ├── index.ts
    ├── create.ts           # Create service function
    ├── update.ts           # Update service function
    ├── delete.ts           # Delete service function
    ├── get.ts              # Get single item
    └── getAll.ts           # Get all items with pagination
```

### Middleware (`src/router/middleware/<module>/`)

```
src/router/middleware/<module>/
├── index.ts
└── <model>/
    ├── index.ts
    ├── admin.ts            # Admin route middleware
    └── store.ts            # Store route middleware
```

---

## 📖 Examples

### Example 1: Generate All Artifacts (Recommended)

Generate everything for the `event` module:

```bash
medusa-gen event --all
```

**Expected model location:** `src/modules/event/models/*.ts`

**Console output:**
```
✓ Found Model Name: Event
✓ Found Table Name: event
Created HttpType: src/types/event/http/event.ts
Created ModulesType: src/types/event/module/event.ts
Created QueryType: src/types/event/query/event.ts
Created ServiceType: src/types/event/service/event.ts

Generation types of event from event Complete! 🚀

Created generateCreateSteps: src/workflows/event/steps/event/create.ts
Created generateUpdateSteps: src/workflows/event/steps/event/update.ts
...

Generation workflow event from event Complete! 🚀
Generation Service event from event Complete! 🚀
```

### Example 2: Generate Specific Components

Generate only types and workflows for the `ticket` module:

```bash
medusa-gen ticket --type --workflow
```

### Example 3: Multiple Models in a Module

If your module has multiple model files:

```
src/modules/finance/models/
├── credit-wallet.ts
├── transaction.ts
└── ledger.ts
```

Running:
```bash
medusa-gen finance --all
```

Will generate artifacts for **all three models** in a single command.

### Example 4: Development Mode (No Build)

Run directly from TypeScript source without building:

```bash
bun run src/index.ts event --all
```

### Example 5: Custom Output Directory

Specify a different output root:

```bash
medusa-gen event --all --output ./generated
```

---

## 🛠 Development

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd medusa-scaffolder

# Install dependencies
bun install

# Run in development mode
bun run src/index.ts <module> --all
```

### Build for Production

```bash
bun run build
```

This compiles TypeScript to `./dist/` and links the CLI globally.

### Key Dependencies

| Package | Purpose |
|---------|---------|
| `commander` | CLI argument parsing |
| `ts-morph` | TypeScript AST parsing & manipulation |
| `fs-extra` | Enhanced file system operations |
| `chalk` | Terminal output styling |

### Adding New Generators

1. Create a new template in `src/templates/`
2. Create a generator in `src/generator/`
3. Add a new CLI option in `src/index.ts`
4. Update the action handler to include the new generator

---

## 🔧 Troubleshooting

### Issue: `medusa-gen: command not found`

**Solution:** Run the build command again:
```bash
bun run build
```

Or run directly with Bun:
```bash
bun run src/index.ts <module> --all
```

### Issue: "Could not find an exported model definition"

**Cause:** The model file doesn't follow the expected pattern.

**Solution:** Ensure your model exports a variable using `model.define()`:
```typescript
// ✅ Correct
export const MyModel = model.define("my_model", { ... });

// ❌ Incorrect - not exported
const MyModel = model.define("my_model", { ... });

// ❌ Incorrect - named differently
export const myModel = model.define("my_model", { ... });
```

### Issue: "The first argument to `.define()` must be a string literal"

**Cause:** Using a variable instead of a string literal.

**Solution:**
```typescript
// ✅ Correct
export const MyModel = model.define("my_model", { ... });

// ❌ Incorrect
const tableName = "my_model";
export const MyModel = model.define(tableName, { ... });
```

### Issue: Files not generating in expected location

**Solution:** Ensure your model files are in the correct location:
```
src/modules/<module-name>/models/<model-file>.ts
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📚 Quick Reference Card

```bash
# Install & Setup
bun install && bun run build

# Generate all artifacts for a module
medusa-gen <module> --all

# Generate specific artifacts
medusa-gen <module> --type --workflow
medusa-gen <module> --service --middleware

# Development mode (skip build)
bun run src/index.ts <module> --all

# Help & Version
medusa-gen --help
medusa-gen --version
```

---

## 📄 License

Private - All rights reserved.

---

<div align="center">
Created with ❤️ for the MedusaJS ecosystem
</div>
