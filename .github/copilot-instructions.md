# NPM Package with Automatic Publishing

This is a complete npm package environment configured for:
- Automatic publishing to npm registry via GitHub Actions
- Continuous Integration on push/PR
- Multi-version Node.js testing
- Code linting and formatting
- Comprehensive test coverage

## Setup Steps Completed

✅ Package structure with TypeScript
✅ Build, test, and lint configuration
✅ GitHub Actions CI/CD workflows
✅ Documentation and examples

## Next Steps to Publish

### 1. Initialize Git Repository
```bash
cd /home/haim/code/mvvm-mobx
git init
git add .
git commit -m "Initial commit: npm package setup with CI/CD"
```

### 2. Create GitHub Repository
- Go to https://github.com/new
- Create a new repository named `mvvm-mobx`
- Push your local code:
  ```bash
  git remote add origin https://github.com/yourusername/mvvm-mobx.git
  git branch -M main
  git push -u origin main
  ```

### 3. Configure NPM Token
- Create npm account at https://www.npmjs.com
- Generate token at Settings → Auth Tokens (type: Automation)
- Add to GitHub: Repository Settings → Secrets → `NPM_TOKEN`

### 4. Update Package Metadata
In `package.json`:
- Change `"@yourusername/mvvm-mobx"` to your actual npm package name
- Update `author`, `repository.url`, and keywords

### 5. Build and Test Locally
```bash
npm install
npm run build
npm run test
```

### 6. Publish to NPM
Choose one method:

**Method A: GitHub Release (Recommended)**
1. Create release on GitHub (e.g., v1.0.0)
2. Workflow automatically publishes to npm

**Method B: Version Update**
1. Update version in `package.json`
2. Push to main branch
3. Workflow automatically publishes

## GitHub Actions Workflows

### `.github/workflows/ci.yml`
- Runs on: push to main/develop, pull requests
- Tests Node 16, 18, 20
- Uploads coverage to Codecov

### `.github/workflows/publish.yml`
- Runs on: GitHub release or package.json version change
- Lints, tests, builds, and publishes to npm

## Key Files

- `package.json` - Package metadata and scripts
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Test configuration
- `.eslintrc.json` - Linting rules
- `.prettierrc.json` - Code formatting
- `src/core/ViewModel.ts` - Core implementation
- `.github/workflows/` - CI/CD automation

## Available Commands

```bash
npm install          # Install dependencies
npm run build       # Build TypeScript
npm run build:watch # Watch mode
npm run test        # Run tests
npm run test:watch  # Watch test mode
npm run lint        # Lint code
npm run lint:fix    # Fix linting issues
npm run format      # Format code
npm run clean       # Remove build artifacts
```
