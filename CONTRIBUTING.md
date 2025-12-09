# Contributing to Medusa Scaffolder

First off, thank you for considering contributing to Medusa Scaffolder! 🎉

It's people like you that make this tool better for everyone in the MedusaJS community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0.0 or higher
- [Node.js](https://nodejs.org) v18.0.0 or higher
- Basic understanding of MedusaJS architecture

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/medusa-scaffolder.git
   cd medusa-scaffolder
   ```

3. **Install dependencies**
   ```bash
   bun install
   ```

4. **Create a branch for your changes**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Run in development mode**
   ```bash
   bun run src/index.ts <module> --all
   ```

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

When reporting a bug, include:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment (OS, Bun version, Node version)
- Any relevant error messages or logs

### 💡 Suggesting Features

Feature requests are welcome! Please provide:
- A clear description of the feature
- The problem it solves
- Example use cases
- Possible implementation approaches (optional)

### 🔧 Code Contributions

Great areas to contribute:
- **New generators** - Add support for generating new artifact types
- **Template improvements** - Enhance the generated code quality
- **Bug fixes** - Help squash bugs
- **Documentation** - Improve docs, examples, and guides
- **Tests** - Add test coverage

## Pull Request Process

1. **Update documentation** if your changes affect usage
2. **Follow the style guidelines** outlined below
3. **Write clear commit messages**
4. **Link related issues** in your PR description
5. **Request a review** from maintainers

### PR Title Format

Use conventional commit format:
- `feat: add new validator generator`
- `fix: resolve path resolution issue on Windows`
- `docs: update installation instructions`
- `refactor: simplify template rendering logic`

## Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Prefer `const` over `let` when possible
- Use async/await over raw Promises

### Code Structure

```typescript
// Good: Clear, descriptive function
export const generateHttpTypes = ({
  modelName,
  tableName,
  fileName,
}: TemplateData): string => {
  // Implementation
};

// Good: Meaningful error messages
if (!targetDecl) {
  console.error(
    chalk.red("Error: Could not find an exported model definition")
  );
  process.exit(1);
}
```

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Keep the first line under 72 characters
- Reference issues in the body when applicable

## 📁 Project Structure

When adding new features, follow the existing structure:

```
src/
├── extractor/     # Model parsing logic
├── generator/     # Code generation orchestration
├── templates/     # Code templates (add new templates here)
├── type/          # TypeScript interfaces
└── utils/         # Utility functions
```

### Adding a New Generator

1. Create template(s) in `src/templates/<category>/`
2. Create generator in `src/generator/<name>.ts`
3. Add CLI option in `src/index.ts`
4. Update README documentation

## 🙏 Thank You!

Your contributions make this project better for the entire MedusaJS community. We appreciate your time and effort!

---

Questions? Feel free to open an issue for discussion.
