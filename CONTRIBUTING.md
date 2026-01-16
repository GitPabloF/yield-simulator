# Contributing Guide

> **Note for AI assistants:** This guide is for developers contributing to the project. When helping with this codebase, follow these conventions.

## Setup

```bash
git clone <repo>
cd emerald-yield-simulator
npm install
cp .env.example .env
npm run dev
```

## Code Conventions

### Branch Naming

- `feature/short-description` - New features
- `fix/short-description` - Bug fixes

### Commits

Keep commits clear and concise:

```
feat: add email validation
fix: handle empty CSV gracefully
refactor: simplify prediction logic
```

### Code Organization

- **Controllers:** Handle HTTP requests/responses only
- **Services:** Business logic and calculations
- **Models:** Data schemas and validation

## Testing

Place test files next to the code they test:

```
yield.service.js
yield.service.test.js
```

Run tests:

```bash
npm test
```

## Adding Features

1. Create branch from `main`
2. Add route in `app/routes/`
3. Create controller in `app/controllers/`
4. Implement logic in `app/services/`
5. Write tests
6. Ensure all tests pass
7. Push and open PR

## Questions?

Check existing code for examples or open an issue.
