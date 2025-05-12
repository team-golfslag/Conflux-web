# Conflux Frontend

This is the repository of the team Golfslag frontend for Conflux.

## License

This project is licensed under the GNU Affero General Public License version 3 (AGPL-3.0). Please see the [LICENSE](LICENSE) file for more details.

© Copyright Utrecht University (Department of Information and Computing Sciences)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node Version Manager (nvm)
- Node.js (version specified in [.nvmrc](.nvmrc)) - nvm will help you manage this.
- npm (comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/team-golfslag/Conflux-web.git
    cd conflux-web
    ```
2.  **Set the correct Node.js version using nvm:**
    ```sh
    nvm use
    ```
    If you don't have the specified Node.js version installed, nvm will prompt you to install it.
3.  **Install dependencies and perform initial setup:**
    This command will install all necessary dependencies and purge any old Vite cache.
    ```sh
    npm run reset
    ```
    Alternatively, you can install dependencies manually:
    ```sh
    npm i
    ```

### Running the Development Server

To start the development server with hot reloading:

```sh
npm run dev
```

This will typically open the application in your default web browser at `http://localhost:5173` (or another port if 5173 is in use).

## Building the Project

### Standard Build

To create a production-ready build:

```sh
npm run build
```

This command first runs `tsc -b` to check TypeScript types and then `vite build` to bundle the application. The output will be in the [`dist`](dist) folder.

### Production Build with Specific Environment

To create a production build explicitly setting `NODE_ENV=production`:

```sh
npm run build:prod
```

### Previewing the Production Build

After building the project, you can preview the production build locally:

```sh
npm run preview
```

## ✨ Code Quality

### Linting

To check the codebase for linting errors according to the ESLint configuration (eslint.config.js):

```sh
npm run lint
```

### Formatting

To automatically fix linting errors and format the code using ESLint and Prettier (.prettierrc):

```sh
npm run format
```

This command is also configured as a pre-commit hook using Husky (.husky/pre-commit), ensuring code is formatted before committing.

## Testing

This project uses Cypress for end-to-end and component testing.

- Cypress configuration can be found in [`cypress.config.ts`](cypress.config.ts).
- Custom commands are located in [`cypress/support/commands.ts`](cypress/support/commands.ts).
- The component testing HTML harness is [`cypress/support/component-index.html`](cypress/support/component-index.html).

To open the Cypress test runner:

```sh
npx cypress open
```

From the Cypress interface, you can choose to run E2E or Component tests.

## Other Useful Scripts

### Purge Vite Cache

If you encounter issues with the Vite development server or build process, you can clear the Vite cache:

```sh

npm run purge-vite
```

## Docker

A [`Dockerfile`](Dockerfile) and [`.dockerignore`](.dockerignore) are provided for containerizing the application.

### Building the Docker Image

To build the Docker image, navigate to the root directory of the project (where the `Dockerfile` is located) and run:

```sh
docker build -t conflux-web .
```

Replace `conflux-web` with your desired image name and tag if needed.

### Running the Docker Container

Once the image is built, you can run it as a container:

```sh
docker run -p 80:80 conflux-web
```

## Environment Variables

This project uses `.env` files to manage environment-specific configurations. Vite will automatically load variables from the appropriate file based on the command being run:

- `.env`: Used for development, and contains default values.
- `.env.production`: Overrides `.env` when running in production mode (e.g., `npm run build`).

**`.env` (for development/default):**

```dotenv
VITE_API_URL=http://localhost:8000
VITE_WEBUI_URL=http://localhost:5173
```

**Example `.env.production` (for production builds):**

```dotenv
VITE_API_URL=https://api.conflux.example.com
VITE_WEBUI_URL=https://conflux.example.com
```

**Variables:**

- `VITE_API_URL`: Specifies the base URL for the API that the frontend will communicate with.
- `VITE_WEBUI_URL`: Specifies the base URL where the frontend application is served.

These variables are loaded by Vite during development and build processes. Make sure these files are present and correctly configured before running or building the application.

## Project Structure

A brief overview of the project structure:

```
.
├── .github/          # GitHub Actions workflows and PR templates
├── .husky/           # Husky pre-commit hooks
├── cypress/          # Cypress E2E and component tests
├── public/           # Static assets
├── src/              # Application source code
│   ├── components/   # React components (including UI components from shadcn)
│   ├── config.ts     # Application configuration
│   ├── main.tsx      # Main application entry point
│   └── ...
├── Dockerfile        # Docker configuration
├── nginx.conf        # Nginx configuration for Docker
├── package.json      # Project dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── vite.config.ts    # Vite configuration
└── README.md         # This file
```

## Contributing

Please refer to the pull request template at [`.github/pull_request_template.md`](.github/pull_request_template.md) when contributing to this project. Ensure your code is formatted by running `npm run format` before submitting a pull request.
