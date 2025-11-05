# 🤝 Contributing to MangaSelf

Thank you for considering contributing to MangaSelf! This document will guide you through the contribution process.

## 🌟 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🎨 Improve UI/UX
- 💻 Submit code changes
- 🧪 Write tests
- 🌐 Translate to other languages

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/mangaself.git
cd mangaself
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Follow steps in `QUICKSTART.md` to setup Supabase and environment variables.

### 4. Create Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `style/` - UI/UX improvements
- `refactor/` - Code refactoring
- `test/` - Adding tests

## 💻 Development Guidelines

### Code Style

- Use **functional components** with hooks
- Follow **ESLint** rules
- Use **TailwindCSS** for styling
- Add **dark mode** support for new UI
- Keep components **small and focused**
- Use **meaningful variable names**

### Component Structure

```jsx
// Good component example
import { useState } from 'react'
import { useCustomHook } from '../hooks/useCustomHook'

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState('')
  const { data, loading } = useCustomHook()

  const handleAction = () => {
    // Handle action
  }

  if (loading) return <Loading />

  return (
    <div className="card">
      {/* Component content */}
    </div>
  )
}
```

### File Organization

```
src/
├── components/
│   ├── common/       # Reusable components
│   ├── layout/       # Layout components
│   ├── manga/        # Manga-specific components
│   └── ...
├── pages/            # Page components
├── hooks/            # Custom hooks
├── services/         # External services
├── store/            # State management
└── utils/            # Utility functions
```

### Styling Guidelines

- Use Tailwind utility classes
- Follow existing color scheme
- Support dark mode with `dark:` prefix
- Use consistent spacing (4, 6, 8 units)
- Add hover states for interactive elements
- Ensure mobile responsiveness

### Database Changes

If you need to modify database:

1. Update `supabase-schema.sql`
2. Document changes in PR
3. Ensure RLS policies are correct
4. Test with multiple users

## 🧪 Testing

Before submitting:

```bash
# Build test
npm run build

# Check for errors
npm run lint

# Manual testing
npm run dev
```

Test checklist:
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Dark mode works
- [ ] User permissions correct
- [ ] Database operations successful

## 📝 Commit Guidelines

Use conventional commits:

```bash
# Format
<type>(<scope>): <description>

# Examples
feat(manga): add genre filter
fix(auth): resolve login redirect issue
docs(readme): update installation steps
style(ui): improve card hover effect
refactor(hooks): simplify useManga hook
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - UI/styling
- `refactor` - Code refactoring
- `test` - Testing
- `chore` - Maintenance

## 🔄 Pull Request Process

### 1. Update Your Fork

```bash
git fetch origin
git rebase origin/main
```

### 2. Push Changes

```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in PR template:

```markdown
## Description
[Brief description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
[How you tested the changes]

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tested on mobile
- [ ] Dark mode works
```

### 4. Review Process

- Maintainer will review your PR
- Address any feedback
- Once approved, PR will be merged

## 🐛 Bug Reports

Create an issue with:

**Title**: Clear, descriptive title

**Description**:
```markdown
## Bug Description
[Clear description of the bug]

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots
[If applicable]

## Environment
- Browser: [e.g. Chrome 120]
- OS: [e.g. Windows 11]
- Device: [e.g. Desktop, Mobile]

## Additional Context
[Any other context]
```

## 💡 Feature Requests

Create an issue with:

```markdown
## Feature Description
[Clear description of proposed feature]

## Problem it Solves
[What problem does this solve?]

## Proposed Solution
[How would this work?]

## Alternatives Considered
[Other approaches you considered]

## Additional Context
[Mockups, examples, etc.]
```

## 📋 Development Roadmap

### Planned Features

- [ ] PWA support
- [ ] Image upload (vs URL only)
- [ ] User following system
- [ ] Manga collections
- [ ] Reading progress sync
- [ ] Notifications system
- [ ] Manga recommendations
- [ ] API rate limiting
- [ ] Advanced search
- [ ] Export data

Want to work on one? Create an issue first!

## 🏆 Recognition

Contributors will be:
- Added to README.md
- Mentioned in release notes
- Forever appreciated! ❤️

## 📞 Questions?

- Create a GitHub issue
- Tag with `question` label
- We'll respond ASAP!

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to MangaSelf! 🎉📚**
