# 🤝 Contributing to Fletchly.io

<div align="center">

![Contributing](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)
[![Contributors](https://img.shields.io/github/contributors/Ayush-patel9/docubuddy-answer-central?style=for-the-badge)](https://github.com/Ayush-patel9/docubuddy-answer-central/graphs/contributors)

**We love your input! We want to make contributing to Fletchly.io as easy and transparent as possible.**

</div>

---

## 🎯 Ways to Contribute

- 🐛 **Bug Reports**: Found a bug? Let us know!
- ✨ **Feature Requests**: Have an idea? We'd love to hear it!
- 📝 **Documentation**: Help improve our docs
- 💻 **Code**: Submit bug fixes or new features
- 🎨 **Design**: Improve UI/UX components
- 🧪 **Testing**: Add test cases or improve existing ones

---

## 🚀 Getting Started

### 1. Fork & Clone
```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/docubuddy-answer-central.git
cd docubuddy-answer-central

# Add upstream remote
git remote add upstream https://github.com/Ayush-patel9/docubuddy-answer-central.git
```

### 2. Set Up Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

### 3. Create a Branch
```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name
```

---

## 📋 Development Guidelines

### Code Style
- Use **TypeScript** for all new code
- Follow **ESLint** configuration
- Use **Prettier** for formatting
- Write **meaningful commit messages**

### Component Guidelines
```typescript
// ✅ Good: Use TypeScript interfaces
interface ChartProps {
  data: ChartData[];
  type: ChartType;
  theme?: 'light' | 'dark';
}

// ✅ Good: Functional components with proper typing
const Chart: React.FC<ChartProps> = ({ data, type, theme = 'dark' }) => {
  // Component logic
};

// ✅ Good: Use proper naming conventions
const handleDataProcessing = () => {
  // Function logic
};
```

### Testing Guidelines
```typescript
// ✅ Write tests for new features
describe('Chart Component', () => {
  it('should render with provided data', () => {
    // Test implementation
  });
  
  it('should handle empty data gracefully', () => {
    // Test implementation
  });
});
```

---

## 🐛 Bug Reports

### Before Submitting a Bug Report
- Check existing issues to avoid duplicates
- Test with the latest version
- Gather relevant information

### Bug Report Template
```markdown
**Describe the Bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.2.3]
```

---

## ✨ Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the feature you'd like to see.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How would you like it to work?

**Alternatives Considered**
Any alternative solutions you've considered.

**Additional Context**
Any other context, screenshots, or examples.
```

---

## 💻 Pull Request Process

### 1. Before Creating a PR
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No merge conflicts

### 2. PR Title Format
```
type(scope): description

Examples:
feat(charts): add bar chart animation
fix(api): resolve data loading issue
docs(readme): update installation guide
```

### 3. PR Description Template
```markdown
## 🎯 Description
Brief description of changes made.

## 🔗 Related Issue
Fixes #(issue_number)

## 🧪 Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing done

## 📸 Screenshots
If applicable, add screenshots of changes.

## 📋 Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
```

---

## 🏗️ Project Structure

```
fletchly-io/
├── src/
│   ├── components/     # Reusable components
│   │   ├── ui/        # Basic UI components
│   │   ├── charts/    # Chart-specific components
│   │   └── layout/    # Layout components
│   ├── pages/         # Application pages
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript type definitions
├── tests/             # Test files
├── docs/              # Documentation
└── public/            # Static assets
```

---

## 🎨 Design Guidelines

### Color Palette
```css
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --accent: #06b6d4;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

### Component Design Principles
- **Consistency**: Follow established patterns
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsiveness**: Mobile-first approach
- **Performance**: Optimize for speed

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Test individual functions/components
import { render, screen } from '@testing-library/react';
import Chart from './Chart';

test('renders chart with data', () => {
  render(<Chart data={mockData} />);
  expect(screen.getByRole('img')).toBeInTheDocument();
});
```

### Integration Tests
```typescript
// Test component interactions
test('chart updates when data changes', async () => {
  // Test implementation
});
```

### E2E Tests
```typescript
// Test user workflows
test('user can create and save chart', async () => {
  // Test implementation
});
```

---

## 📚 Documentation Standards

### Code Comments
```typescript
/**
 * Processes raw data into chart-ready format
 * @param rawData - The raw data array
 * @param options - Processing options
 * @returns Formatted chart data
 */
const processChartData = (rawData: any[], options: ProcessingOptions) => {
  // Implementation
};
```

### API Documentation
```typescript
/**
 * @api {POST} /api/charts Create Chart
 * @apiName CreateChart
 * @apiGroup Charts
 * 
 * @apiParam {Object} data Chart data
 * @apiParam {String} type Chart type
 * 
 * @apiSuccess {Object} chart Created chart object
 */
```

---

## 🚦 Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes prepared

---

## 🎖️ Recognition

### Contributors Hall of Fame
We recognize contributors in various ways:
- GitHub contributors page
- Monthly contributor highlights
- Special Discord role
- Contribution badges

### Contribution Types
| Type | Badge | Description |
|------|-------|-------------|
| 💻 Code | Coder | Code contributions |
| 📖 Documentation | Documenter | Documentation improvements |
| 🐛 Bug Reports | Bug Hunter | Quality bug reports |
| 💡 Ideas | Ideator | Feature suggestions |
| 🎨 Design | Designer | UI/UX contributions |

---

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: General questions and ideas
- **Discord**: Real-time chat with the community
- **Email**: team@fletchly.io for sensitive matters

### Response Times
- **Bug Reports**: 24-48 hours
- **Feature Requests**: 3-5 days
- **PRs**: 2-3 days
- **Questions**: 1-2 days

---

<div align="center">

## 🙏 Thank You!

**Every contribution, no matter how small, makes a difference!**

[![Contributors](https://contrib.rocks/image?repo=Ayush-patel9/docubuddy-answer-central)](https://github.com/Ayush-patel9/docubuddy-answer-central/graphs/contributors)

*Made with ❤️ by the Fletchly community*

</div>
