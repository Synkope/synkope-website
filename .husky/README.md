# Git Hooks

This directory contains Git hooks managed by [Husky](https://typicode.github.io/husky/).

## Available Hooks

### pre-commit

Runs automatically before each commit to ensure code quality:

- **Linting**: ESLint checks all staged JavaScript files
- **Formatting**: Prettier validates code formatting for HTML, CSS, JS, and JSON files
- **JSON Validation**: Ensures all JSON files are valid

## Installation

Hooks are automatically installed when you run:

```bash
npm install
```

## Skipping Hooks

If you need to skip the pre-commit checks (not recommended), use:

```bash
git commit --no-verify
```

## Fixing Issues

If the pre-commit hook fails:

1. **For linting issues**:
   ```bash
   npm run lint:fix
   ```

2. **For formatting issues**:
   ```bash
   npm run format
   ```

3. **For JSON issues**: Manually fix the syntax errors in the reported file

## Manual Hook Execution

To test the pre-commit hook without committing:

```bash
./.husky/pre-commit
```
