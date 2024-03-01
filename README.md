# R6 Index

## Overview

R6 Index is a player stats and analytics tool for Rainbow Six Siege. The project is a monorepo managed with [Turborepo](https://turbo.build/repo) and [PNPM workspaces](https://pnpm.io) and contains a simplified version of R6 Index's stats tool, that allows users to host and run their own stats tracker.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Development](#development)
    - [Environment Variables](#environment-variables)
    - [Development Server](#development-server)
    - [Development Database](#development-database)
  - [Deployment](#deployment)
  - [Notes](#notes)
- [Known Issues](#known-issues)
- [Acknowledgments](#acknowledgments)

## Project Structure

```sh
r6index-v2/
│
├── apps/ # Contains the main applications
│ ├── web/ # The Remix Web Application
│ └── profiler/ # Vercel serverless function
│
├── packages/ # Shared Packages
│ ├── configs/ # Shared configuration files (e.g., Ranked, Seasons)
│ ├── db/ # Database Client, Schema and Migrations
│ ├── shared-types/ # Shared types and interfaces
│ └── ubisoft-api-client/ # Ubisoft API Client
│
└── workers/ # Cloudflare Workers
  ├── auth/ # Auth Worker (Handles rolling ubisoft apiauthentication)
  └── indexer/ # Indexer Worker (Consumer that processes batched profiles for indexing)
```

## Getting Started

### Prerequisites

Prerequisites needed to run the project are the following:

- [Supabase](https://supabase.io/) - PostgreSQL Database
- [Cloudflare](https://www.cloudflare.com/) - Hosting, Workers, Queue, Durable Objects, and KV
- [Vercel](https://vercel.com/) - Serverless Functions
- [PNPM](https://pnpm.io) - Package Manager
- [BiomeJS](https://biomejs.com) - Format and Lint
- [Uplay](https://account.ubisoft.com/en-US/login) - Ubisoft Uplay Account for API access

### Installation

Clone repository, ensure [PNPM](https://pnpm.io/installation#using-corepack) is installed. Then, execute the following command in the root:

1. Install the dependencies

```sh
pnpm install
```

2. Set up environment variables

You will have to set up environment variables.

`.dev.vars.example` files are provided in the following packages:

- `apps/web`
- `workers/auth`
- `workers/indexer`

These files should be copied and renamed to `.dev.vars` and the environment variables should be set accordingly if needed.

`.env.local` and `.env.production` files are provided in the `packages/db` package. These files should be copied and renamed to `.env.local` and `.env.production` and the environment variables should be set accordingly if needed for the database. 

3. Run the setup script

This sets up a local supabase instance and seeds the database with initial data.

```sh
pnpm run setup
```

4. Start the development server

```sh
pnpm run dev
```

## Usage

### Development

Please ensure [Installation](#installation) steps were followed before hand and the project is set up correctly. You will also have to set up environment variables in different packages due to the way wrangler run the development environment. 

#### Environment Variables

`.dev.vars.example` files are provided in the following packages:

- `apps/web`
- `workers/auth`
- `workers/indexer`

These files should be copied and renamed to `.dev.vars` and the environment variables should be set accordingly if needed.

`.env.local` and `.env.production` files are provided in the `packages/db` package. These files should be copied and renamed to `.env.local` and `.env.production` and the environment variables should be set accordingly if needed for the database. 

#### Development Server

The development server can be started with the following command:

```sh
pnpm run dev
```

This will start the auth and indexer workers and the remix web application. The profiler serverless function will not be started as it is only used in a production environment. This was a stopgap measure due to Ubisoft's api blocking requests from cloudflare workers.

#### Development Database

Again, please ensure [Installation](#installation) steps were followed before hand and the project is set up correctly. If not completed, initial migrations may not have been applied and no data will have been inserted.

To check if Supabase is running, you can use the following command:

```sh
pnpm run db:status
```

The development database can be started with the following command:

```sh
pnpm run db:start
```

This will start a local supabase instance and seed the database with initial data. The admin interface can be accessed at `localhost:54323/`.

Once you are done with development, you can stop the database with the following command:

```sh
pnpm run db:stop
```

### Deployment

The production environment is managed by Vercel and Cloudflare. The Remix web application is hosted on Cloudflare Pages, the profiler serverless function is hosted on Vercel, and the workers are hosted on Cloudflare Workers. Additionally, Cloudflare KV, Durable Objects, and Queue are used to store and manage events and data.

Github Actions are provided to deploy changes automatically to the production environment. To use this, you will need to set up the following secrets in your repository:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_AW_TOKEN`
- `SUPABASE_URL`
- `UBISOFT_APPID`
- `UBISOFT_CLIENT_ID_{n}`
- `UBISOFT_CLIENT_PASSWORD_{n}`
- `UBISOFT_NEWAPPID`
- `UBISOFT_URL`
- `UBISOFT_USERAGENT`
- `VERCEL_TOKEN`

### Notes

The use of Vercel Functions: Frustratingly, this was a stopgap measure due to Ubisoft's api blocking requests from cloudflare workers. This is not ideal and should be replaced with an alternative solution if serious about using this project.

Rate Limiting: The project does not include rate limiting, this should be added if serious about using this project.

## Known Issues

- Responsive Issues on Smaller Screens (1023px and below)
- Ubisoft blocks CF workers on certain api endpoints
- Profile Button on /profile/maps, /profile/operators etc. missing
- Pill in AnimatedTabs may not show up on initial render
- Search Menu Profiles may not show up on initial render

## LICENSE

[MIT](https://choosealicense.com/licenses/mit/)

