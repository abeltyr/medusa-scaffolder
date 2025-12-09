# Medusa Scaffolder

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![Bun](https://img.shields.io/badge/bun-%3E%3D1.0.0-orange.svg)
![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)

**A powerful CLI tool designed to accelerate MedusaJS development by automating the generation of essential code artifacts.**

</div>

---

## 📋 Table of Contents

- [Why This Tool?](#-why-this-tool)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [CLI Usage](#-cli-usage)
- [Generated Project Layout](#-generated-project-layout)
- [Examples](#-examples)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 💡 Why This Tool?

This scaffolder was created to **quickly bootstrap basic CRUD operations** in MedusaJS projects. When starting a new module that only needs standard Create, Read, Update, and Delete functionality—without advanced features—setting up all the boilerplate manually is tedious and error-prone.

**Instead of spending hours writing:**
- Type definitions for HTTP responses, modules, queries, and services
- Workflow steps for create, update, delete, and unlink operations
- Service layer functions for CRUD operations
- Middleware for admin and store routes

**Just run one command and get a complete, consistent base setup in seconds.**

This is ideal for:
- 🚀 **Rapid prototyping** - Get a working CRUD module quickly
- 📦 **New modules** - Bootstrap standard entity management
- 🔄 **Consistency** - Ensure all modules follow the same patterns
- ⏱️ **Time savings** - Focus on business logic, not boilerplate

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔷 **Type Generation** | Creates TypeScript interfaces for HTTP responses, modules, queries, and services |
| ⚡ **Workflow Generation** | Scaffolds complete workflow definitions with `create`, `update`, `delete`, and `unlink` steps |
| 🛠 **Service Generation** | Generates full CRUD service layer (create, update, delete, get, getAll) |
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
  ```typescript
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
});
```

---

## 📂 Generated Project Layout

When you run `medusa-gen` for your modules, it creates a well-organized structure following MedusaJS best practices:

```
src/
├── admin/                          # Admin UI components (manual)
├── api/                            # API routes (manual)
├── jobs/                           # Background jobs (manual)
├── links/                          # Module links (manual)
├── modules/                        # Your data models (input)
│   └── <module>/
│       └── models/
│           └── <model>.ts          # ← Your model files go here
│
├── router/                         # Generated router layer
│   ├── middleware/                 # API middleware
│   │   └── <module>/
│   │       └── <model>/
│   │           ├── index.ts
│   │           ├── admin.ts        # Admin route middleware
│   │           └── store.ts        # Store route middleware
│   │
│   ├── query/                      # Query definitions (manual)
│   │
│   ├── service/                    # Generated service layer
│   │   └── <module>/
│   │       └── <model>/
│   │           ├── index.ts
│   │           ├── create.ts       # Create service
│   │           ├── update.ts       # Update service
│   │           ├── delete.ts       # Delete service
│   │           ├── get.ts          # Get single item
│   │           └── getAll.ts       # Get all with pagination
│   │
│   └── validators/                 # Request validators (manual)
│
├── scripts/                        # Scripts (manual)
├── subscribers/                    # Event subscribers (manual)
│
├── types/                          # Generated type definitions
│   ├── index.ts                    # Main barrel export
│   ├── shared.ts                   # Shared types
│   └── <module>/
│       ├── index.ts
│       ├── http/
│       │   ├── index.ts
│       │   └── <model>.ts          # HTTP response types
│       ├── module/
│       │   ├── index.ts
│       │   └── <model>.ts          # Module types (Create/Update)
│       ├── query/
│       │   ├── index.ts
│       │   └── <model>.ts          # Query types
│       └── service/
│           ├── index.ts
│           └── <model>.ts          # Service filter types
│
├── utils/                          # Utilities (manual)
│
└── workflows/                      # Generated workflows
    ├── index.ts                    # Main barrel export
    ├── account/
    ├── analytic/
    └── <module>/
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

### What Gets Generated vs Manual

| Generated by `medusa-gen` | Created Manually |
|---------------------------|------------------|
| `src/types/<module>/`  | `src/router/query/` |
| `src/workflows/<module>/` | `src/router/validators/` |
| `src/router/service/<module>/` | `src/modules/<module>/types/` |
| `src/router/middleware/<module>/` | |


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
Created generateDeleteSteps: src/workflows/event/steps/event/delete.ts
Created generateUnlinkSteps: src/workflows/event/steps/event/unlink.ts
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

The `medusa-gen` tool can handle multiple models in a module. If your module has multiple model files:

```
src/modules/finance/models/
├── credit-wallet.ts
├── transaction.ts
└── ledger.ts
```

Just run as usual:
```bash
medusa-gen finance --type
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

### Project Structure

```
medusa-scaffolder/
├── src/
│   ├── index.ts              # Main CLI entry point
│   ├── extractor/            # Model parsing & metadata extraction
│   │   ├── getAllFiles.ts
│   │   ├── name.ts
│   │   ├── source.ts
│   │   └── data.ts
│   ├── generator/            # Code generation logic
│   │   ├── type.ts
│   │   ├── workflow.ts
│   │   ├── services.ts
│   │   └── middleware.ts
│   ├── templates/            # Code templates
│   │   ├── type/
│   │   ├── workflows/
│   │   ├── router/
│   │   └── index/
│   ├── type/
│   └── utils/
├── dist/
├── package.json
└── tsconfig.json
```

### Key Dependencies

| Package | Purpose |
|---------|---------|
| `commander` | CLI argument parsing |
| `ts-morph` | TypeScript AST parsing |
| `fs-extra` | Enhanced file system operations |
| `chalk` | Terminal output styling |

---

## 🔧 Troubleshooting

### `medusa-gen: command not found`

**Solution:** Run the build command:
```bash
bun run build
```

Or run directly:
```bash
bun run src/index.ts <module> --all
```

### "Could not find an exported model definition"

**Solution:** Ensure your model exports a variable using `model.define()`:
```typescript
// ✅ Correct
export const MyModel = model.define("my_model", { ... });

// ❌ Incorrect - not exported
const MyModel = model.define("my_model", { ... });
```

### "The first argument to `.define()` must be a string literal"

**Solution:** Use a string literal, not a variable:
```typescript
// ✅ Correct
export const MyModel = model.define("my_model", { ... });

// ❌ Incorrect
const tableName = "my_model";
export const MyModel = model.define(tableName, { ... });
```

---

## 📚 Quick Reference

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

# Help
medusa-gen --help
```

---

## 📄 License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<div align="center">

**Made with ❤️ for the MedusaJS ecosystem**

*Simplifying CRUD boilerplate so you can focus on what matters*

</div>
