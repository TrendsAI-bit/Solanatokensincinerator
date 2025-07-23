# 🤝 Contributing

Welcome to the Bonkseus Incinerator community! We're excited to have you contribute to the future of token burning.

## 🌟 Ways to Contribute

### 🐛 Bug Reports
Help us improve by reporting bugs you encounter:
- **Search existing issues** before creating new ones
- **Provide detailed descriptions** of the problem
- **Include steps to reproduce** the issue
- **Share browser and wallet information**
- **Add screenshots or videos** when helpful

### ✨ Feature Requests
Suggest new features to enhance the platform:
- **Describe the feature** and its benefits
- **Explain the use case** and target users
- **Consider implementation complexity**
- **Discuss potential alternatives**
- **Include mockups or wireframes** if possible

### 📝 Documentation
Improve our documentation:
- **Fix typos and grammatical errors**
- **Add missing information**
- **Create new guides and tutorials**
- **Translate content** to other languages
- **Update outdated information**

### 💻 Code Contributions
Contribute to the codebase:
- **Bug fixes** and performance improvements
- **New features** and enhancements
- **UI/UX improvements**
- **Test coverage** expansion
- **Code refactoring** and optimization

## 🚀 Getting Started

### 1. Fork the Repository
```bash
# Fork the repository on GitHub
# Then clone your fork locally
git clone https://github.com/YOUR_USERNAME/bonkseus-incinerator.git
cd bonkseus-incinerator
```

### 2. Set Up Development Environment
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### 3. Create a Feature Branch
```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

## 📋 Contribution Guidelines

### Code Style
- **Use TypeScript** for type safety
- **Follow ESLint rules** defined in the project
- **Use Prettier** for code formatting
- **Write meaningful comments** for complex logic
- **Follow existing naming conventions**

### Component Guidelines
```typescript
// Component structure example
import React from 'react';
import { motion } from 'framer-motion';

interface ComponentProps {
  // Define all props with TypeScript
  title: string;
  description?: string;
  onAction: (value: string) => void;
}

export const ExampleComponent: React.FC<ComponentProps> = ({
  title,
  description,
  onAction
}) => {
  // Component implementation
  return (
    <motion.div
      className="component-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="font-orbitron text-xl">{title}</h2>
      {description && (
        <p className="text-star-white/80">{description}</p>
      )}
    </motion.div>
  );
};
```

### Styling Guidelines
- **Use Tailwind CSS** for styling
- **Follow the space theme** color palette
- **Ensure responsive design** for all screen sizes
- **Test on multiple browsers**
- **Maintain accessibility standards**

### Testing Requirements
```typescript
// Write tests for new features
import { render, screen } from '@testing-library/react';
import { ExampleComponent } from '../ExampleComponent';

describe('ExampleComponent', () => {
  it('renders with required props', () => {
    render(
      <ExampleComponent 
        title="Test Title" 
        onAction={jest.fn()} 
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    const mockAction = jest.fn();
    render(
      <ExampleComponent 
        title="Test" 
        onAction={mockAction} 
      />
    );
    
    // Test interactions
  });
});
```

## 🔄 Development Workflow

### 1. Development Process
```bash
# Make your changes
# Test thoroughly
npm run test
npm run lint
npm run type-check

# Commit your changes
git add .
git commit -m "feat: add new feature description"
```

### 2. Commit Message Format
Follow conventional commit format:
```
type(scope): description

feat: add new feature
fix: resolve bug issue
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add or update tests
chore: maintenance tasks
```

**Examples:**
```bash
feat(ui): add cosmic cursor effects
fix(wallet): resolve connection timeout issue
docs(api): update token burning documentation
style(components): improve responsive design
refactor(utils): optimize token metadata fetching
test(burn): add comprehensive burn flow tests
chore(deps): update dependencies to latest versions
```

### 3. Pull Request Process
1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Requirements**
   - **Clear title** describing the change
   - **Detailed description** of what was changed
   - **Link related issues** using "Fixes #123"
   - **Include screenshots** for UI changes
   - **Add test coverage** for new features

## 📝 Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] New and existing unit tests pass locally
```

## 🎨 Design Contributions

### UI/UX Improvements
- **Follow the space theme** aesthetic
- **Maintain cosmic color palette**
- **Ensure accessibility** compliance
- **Test on various devices** and screen sizes
- **Consider animation performance**

### Visual Assets
- **Icons** should match the cosmic theme
- **Images** should be optimized for web
- **Animations** should be smooth and purposeful
- **Color schemes** should maintain contrast ratios

## 🌐 Community Guidelines

### Code of Conduct
- **Be respectful** and inclusive
- **Help newcomers** learn and contribute
- **Provide constructive feedback**
- **Focus on the issue**, not the person
- **Celebrate contributions** from all community members

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time community chat
- **Twitter**: Updates and announcements

### Review Process
1. **Automated checks** must pass (tests, linting, type checking)
2. **Code review** by maintainers
3. **Testing** on multiple environments
4. **Documentation** updates if needed
5. **Merge** after approval

## 🏆 Recognition

### Contributor Levels
- **First-time contributors**: Welcome package and mentorship
- **Regular contributors**: Special recognition in releases
- **Core contributors**: Invited to maintainer discussions
- **Maintainers**: Full repository access and decision-making

### Hall of Fame
Outstanding contributors will be featured:
- **README acknowledgments**
- **Social media shoutouts**
- **Special Discord roles**
- **Early access** to new features

## 🔧 Development Resources

### Useful Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Web3.js Guide](https://solana-labs.github.io/solana-web3.js/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion API](https://www.framer.com/motion/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### Development Tools
- **VS Code Extensions**:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - GitLens

### Learning Resources
- [Solana Development Course](https://soldev.app/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web3 Development Guides](https://web3.career/)

## 🚨 Issue Labels

### Priority Labels
- `priority: critical` - Security issues or major bugs
- `priority: high` - Important features or significant bugs
- `priority: medium` - Standard improvements
- `priority: low` - Nice-to-have features

### Type Labels
- `type: bug` - Something isn't working
- `type: feature` - New feature request
- `type: enhancement` - Improvement to existing feature
- `type: documentation` - Documentation improvements
- `type: question` - Further information is requested

### Status Labels
- `status: needs-review` - Ready for code review
- `status: in-progress` - Currently being worked on
- `status: blocked` - Cannot proceed due to dependencies
- `status: ready` - Ready to be worked on

## 📞 Getting Help

### Where to Ask Questions
- **GitHub Discussions**: General questions about contributing
- **Discord**: Real-time help and community support
- **GitHub Issues**: Specific technical problems
- **Documentation**: Check existing guides first

### Mentorship Program
New contributors can request mentorship:
- **Pairing sessions** for complex features
- **Code review** guidance
- **Best practices** training
- **Project architecture** overview

---

*Ready to contribute? Join our bonk community at [Bonkseus Incinerator](https://solanatokensincinerator-evd2ucu25-devais-projects-c74be0cf.vercel.app)!* 