# Contributing to LiveWeb

First off, thank you for considering contributing to LiveWeb! It's people like you that make LiveWeb such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- **Be respectful**: Treat everyone with respect and kindness
- **Be collaborative**: Work together and help each other
- **Be inclusive**: Welcome newcomers and diverse perspectives
- **Be constructive**: Provide helpful feedback and suggestions

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)
- Google Gemini API key for testing

### Setup Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:
```bash
git clone https://github.com/YOUR_USERNAME/liveweb.git
cd liveweb
```

3. **Add upstream remote**:
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/liveweb.git
```

4. **Install dependencies**:
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

5. **Create `.env` file**:
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

6. **Run the application**:
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, screenshots, etc.)
- **Describe the behavior you observed** and what you expected
- **Include your environment details** (OS, Node version, browser, etc.)

**Bug Report Template**:
```markdown
**Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g., macOS 14.0]
- Node.js: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]
- LiveWeb Version: [e.g., 1.0.0]

**Additional Context**
Any other relevant information.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the proposed feature
- **Explain why this enhancement would be useful**
- **Include mockups or examples** if applicable

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `bug` - Something isn't working
- `enhancement` - New feature or request

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features (e.g., `feature/add-export-button`)
- `fix/` - Bug fixes (e.g., `fix/voice-recognition-error`)
- `docs/` - Documentation (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/simplify-api-client`)
- `test/` - Adding tests (e.g., `test/add-generation-tests`)
- `chore/` - Maintenance (e.g., `chore/update-dependencies`)

### Making Changes

1. **Create a new branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**:
   - Write clean, readable code
   - Follow the style guidelines
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**:
   - Test manually in the browser
   - Verify voice recognition works
   - Check code generation with various prompts
   - Test on different browsers if possible

4. **Commit your changes**:
```bash
git add .
git commit -m "feat: add amazing feature"
```

5. **Keep your branch updated**:
```bash
git fetch upstream
git rebase upstream/main
```

6. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

## Style Guidelines

### JavaScript/React Style

- Use **ES6+ syntax** (arrow functions, destructuring, etc.)
- Use **functional components** with hooks (not class components)
- Use **const** for variables that don't change, **let** for those that do
- Use **meaningful variable names** (avoid single letters except in loops)
- **Destructure props** in function parameters
- Use **JSDoc comments** for functions

**Example**:
```javascript
/**
 * Generate code using Gemini API
 * @param {string} prompt - User's voice command
 * @param {string} currentCode - Current HTML code
 * @returns {Promise<Object>} Generated code result
 */
export const generateCode = async (prompt, currentCode = '') => {
  // Implementation
};
```

### React Component Structure

```javascript
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * ComponentName - Brief description
 * @param {Object} props - Component props
 */
export const ComponentName = ({ prop1, prop2, onAction }) => {
  const { t } = useTranslation()
  const [state, setState] = useState(initialValue)

  useEffect(() => {
    // Side effects
  }, [dependencies])

  const handleAction = () => {
    // Event handler
  }

  return (
    <div className="...">
      {/* JSX */}
    </div>
  )
}
```

### CSS/Tailwind Guidelines

- Use **Tailwind utility classes** when possible
- Keep custom CSS in separate files when needed
- Use **semantic class names** for custom CSS
- Follow **mobile-first** approach
- Use **CSS variables** for theme colors

### File Organization

- **Components**: One component per file
- **Hooks**: Custom hooks in `hooks/` directory
- **Utils**: Utility functions in `utils/` directory
- **Services**: API calls in `services/` directory
- **Constants**: Constants in `config/constants.js`

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, build, etc.)
- `ci`: CI/CD changes

### Examples

```bash
feat(voice): add support for multiple languages

fix(api): handle timeout errors gracefully

docs(readme): update installation instructions

refactor(hooks): simplify useCodeGeneration hook

chore(deps): update dependencies to latest versions
```

### Rules

- Use **present tense** ("add feature" not "added feature")
- Use **imperative mood** ("move cursor to..." not "moves cursor to...")
- **First line** should be 50 characters or less
- **Body** should wrap at 72 characters
- Reference **issues and PRs** in the footer

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of your own code
- [ ] Commented complex code sections
- [ ] Updated documentation if needed
- [ ] Tested the changes manually
- [ ] No console errors or warnings
- [ ] Commit messages follow conventions

### Submitting a Pull Request

1. **Push your branch** to your fork

2. **Open a Pull Request** on GitHub

3. **Fill in the PR template**:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe your testing process

## Screenshots (if applicable)
Add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tested manually
```

4. **Wait for review** - Maintainers will review your PR

5. **Address feedback** - Make requested changes if needed

6. **Merge** - Once approved, your PR will be merged!

### After Your PR is Merged

- Delete your branch (optional but recommended)
- Update your local repository:
```bash
git checkout main
git pull upstream main
```

## Additional Notes

### Issue and PR Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested
- `wontfix` - This will not be worked on
- `duplicate` - This issue or PR already exists
- `invalid` - This doesn't seem right

### Getting Help

If you need help:
- Check the [documentation](DOCS/)
- Search [existing issues](https://github.com/ORIGINAL_OWNER/liveweb/issues)
- Ask in [GitHub Discussions](https://github.com/ORIGINAL_OWNER/liveweb/discussions)
- Contact maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (if applicable)

Thank you for contributing to LiveWeb! 🎉

