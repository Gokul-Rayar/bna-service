# `bna-service`

**bna-service** is a Node.js + TypeScript repository that provides:

- **Business Logic** – Core operations and services for your application.
- **Data Layer** – Database models and interactions, currently supporting MongoDB.
- **Utilities** – Shared helpers such as logging, configuration management, and database connectivity.

This repository is designed to be a **reusable core service**, intended to be consumed by other projects or scripts, rather than acting as a standalone server application.

## Prerequisites

Before using or building this project, make sure you have the following installed:

- **Node.js** – version `>= 22.0.0` (recommended: latest LTS or stable version)
- **npm** – version `>= 9.0.0` (or the package manager you prefer, e.g., `pnpm` or `yarn`)
- **MongoDB** – required if using database features

**Optional Tools:**

- **TypeScript** – globally installed is optional; the project uses the local version from `devDependencies`
- **ts-node** – for running TypeScript scripts directly

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [Modules](#modules)
3. [Utilities](#utilities)
4. [Usage](#usage)
5. [Available Scripts](#available-scripts)
6. [Development Guidelines](#deveopment-guidelines)

## Folder Structure

The following shows the **base folders and files**. Additional folders and files may exist in the repository as needed:

```
bna-service/
├─ modules/           # Contains business logic and data models (example reference)
│ ├─ index.ts         # Exports service methods
│ ├─ user.model.ts    # Sample model file
│ └─ user.service.ts  # Sample service file
├─ utils/
│ ├─ database.ts      # MongoDB connection configuration
│ ├─ config.ts        # Application configuration variables
│ └─ logger.ts        # Logging utility
├─ index.ts           # Exports modules and utilities
├─ tsconfig.json      # TypeScript configuration
├─ eslint.config.ts   # ESLint configuration
├─ .prettierrc        # Prettier configuration for code formatting
└─ package.json
```

> **Note:** The files in `modules/` and `utils/` shown above are sample references. You can add your own entities following the naming convention: `<entity>.model.ts` and `<entity>.service.ts`, and any utilities your project needs (email, notifications, etc.)

## Modules

All business logic and models reside in the `modules/` folder.

**Sample File Naming Standard:**

- `user.model.ts` – defines the database layer for a user.
- `user.service.ts` – implements the business logic for a user.
- `index.ts` – exports all services from the folder.

**Example Export in `modules/index.ts`:**

```ts
export * from './user.service';
```

This allows consumers to import the business logic via a single module entry point.

## Utilities

The `utils/` folder contains **shared helper functions and utilities** that can be used across modules. This includes, but is not limited to:

- Database connections (`database.ts`)
- Logging (`logger.ts`)
- Configuration (`config.ts`)
- Email utilities
- Notification utilities
- Any other cross-cutting helpers

> The `utils/` folder is intended to centralize reusable code that can be shared across different modules or services.

## Usage

This is a **library-style Node.js + TypeScript project**. There is no server to run. You can use it by importing modules and utilities into your scripts or by starting a Node.js shell. With `ts-node`, you can run TypeScript files directly without pre-building.

### 1. Install Dependencies

Install all project dependencies:

```bash
npm install
```

or if you prefer `pnpm`:

```bash
pnpm install
```

### 2. Using Node.js Shell (REPL)

Start a Node.js shell to interact with modules manually:

```bash
node
```

Then import the modules and utilities:

```ts
// The below code is just an example. You can modify it based on your actual modules and utilities.
// Load utilities and modules
import { dbConnect } from './modules/database';
import { logger } from './utils/logger';
import { userService } from './modules';

// Connect to the database
await dbConnect();

// Call business logic functions
const user = await userService.createUser({ name: 'John Doe', email: 'john@example.com' });
logger.info('User created', user);
```

> This is useful for manual testing or exploring the API.

### 3. Running Scripts Directly with `ts-node`

You can create a TypeScript script (e.g., `example.ts`) to use the modules:

```ts
import { dbConnect } from './modules/database';
import { logger } from './utils/logger';
import { userService } from './modules';

async function main() {
    await dbConnect();
    const user = await userService.createUser({ name: 'Jane Doe', email: 'jane@example.com' });
    logger.info('User created', user);
}

main().catch(console.error);
```

Run the script directly without building:

```bash
npx ts-node example.ts
```

## Available Scripts

The following npm scripts are available in the project. You can run them with:

```bash
npm run <command>
```

```
| Script       | Description                                                                    |
|--------------|--------------------------------------------------------------------------------|
| `build`      | Compiles TypeScript files according to `tsconfig.json` and outputs to `dist/`  |
| `lint`       | Runs ESLint to check code for linting issues on all `.ts` files                |
| `lint:fix`   | Runs ESLint and automatically fixes fixable linting issues                     |
| `format`     | Checks code formatting using Prettier                                          |
| `format:fix` | Automatically fixes code formatting issues using Prettier                      |
| `prepare`    | Installs Husky hooks for pre-commit checks                                     |
```

## Development Guidelines

1. **Folder Organization**
    - Keep `modules/` for business logic and models.
    - Keep `utils/` for shared helper functions (database, logger, email, notifications, etc.).
    - Reuired then consider adding folders like `interfaces/` for TypeScript type definitions, `validators/` for input validation, and `constants/` for shared constants.

2. **File Naming**
    - `<entity>.model.ts` for database layer
    - `<entity>.service.ts` for business logic
    - Keep `index.ts` in each folder to export all public functions/services for easier imports.

3. **Development Workflow**
    - Use `ts-node` to run TypeScript files directly during development for quick iteration.
    - Use the Node.js REPL for manual testing of modules and utilities.
    - Write small scripts to validate business logic or utilities before integrating them into other projects.

4. **Documentation & Code Quality**
    - Maintain JSDoc or inline comments in modules and utilities for clarity.
    - Keep the README updated.

5. **Reusable Utilities**
    - Centralize common functionality (email, notifications, logging, etc.) in `utils/` so it can be reused across modules.
    - Avoid duplicating helper functions inside modules; always import from `utils/`.
# bna-service
