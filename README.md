# Medusa Scaffolder

**Medusa Scaffolder** (`medusa-scaffolder`) is a powerful CLI tool designed to accelerate MedusaJS development by automating the generation of essential code artifacts. It analyzes your data models and creates the corresponding Types, Workflows, Services, and Middleware, ensuring consistency and saving time.

## 🚀 Features

- **Type Generation**: Automatically creates TypeScript definitions derived from your Medusa models.
- **Workflow Generation**: Scaffolds necessary workflow definitions and steps.
- **Service Generation**: Generates service layer boilerplate.
- **Middleware Generation**: Creates middleware structures.
- **Flexible & Modular**: specific artifacts can be generated individually or all at once.

---

## 📦 Installation

Ensure you have [Bun](https://bun.com) installed.

1. **Install Dependencies:**

   ```bash
   bun install
   ```

2. **Build and Link:**
   
   To make the `medusa-gen` command available (and compile the TypeScript source):

   ```bash
   bun run build
   ```

   *This command runs `bunx tsc`, makes the output executable, and links it using `bun link`.*

---

## 💻 CLI Usage

The tool exposes a CLI command named `medusa-gen`.

### Base Command

```bash
medusa-gen <ModuleName> [options]
```

### Arguments

- **`<ModuleName>`**: The name of the module directory you want to target.
  - The tool expects your models to be located in: `src/modules/<ModuleName>/models`.
  - *Example:* If you pass `finance`, it looks in `src/modules/finance/models`.

### Options

| Flag | Description |
| :--- | :--- |
| `--all` | **Recommended.** Generates all supported artifacts (Types, Workflows, Services, Middleware). |
| `--type` | Generate only Type files. |
| `--workflow` | Generate only Workflow files. |
| `--service` | Generate only Service files. |
| `--middleware` | Generate only Middleware files. |
| `-o, --output <dir>` | Specify the output root directory (default: `src/modules`). |
| `-h, --help` | Display help information. |

---

## 📖 Examples

### 1. Generate All Artifacts (Recommended)

To fully scaffold the **event** module (based on models in `src/modules/event/models`):

```bash
medusa-gen event --all
```

### 2. Generate Specific Components

To generate only the **types** and **workflows** for the **ticket** module:

```bash
medusa-gen ticket --type --workflow
```

### 3. Running in Development

If you want to run the tool directly from the source without building:

```bash
bun run src/index.ts event --all
```

---

## 📂 Project Structure

- **`src/index.ts`**: The main entry point for the CLI.
- **`src/extractor/`**: Logic for parsing and extracting metadata from model files.
- **`src/generator/`**: Contains the logic for generating specific file types (types, workflows, etc.).
- **`src/templates/`**: Handlebars or string templates used for code generation.

---

## 🛠️ Development

This project was created using `bun init` in bun v1.3.0.

- **Lint/Check**: Ensure your code follows the project standards.
- **Build**: Run `bun run build` to update the `dist` folder.
