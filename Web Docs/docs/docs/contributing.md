---
id: contributing
# title: Contributing
# sidebar_label: Contributing
---
# Contributing to Scriptable iOS Widgets

We love your input! We want to make contributing to Scriptable iOS Widgets as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Getting Started

### Ways to Contribute

- **🐛 Report bugs** - Found something broken? Let us know!
- **💡 Suggest features** - Have an idea for a new widget or improvement?
- **📝 Improve documentation** - Help make our docs clearer and more helpful
- **🔧 Submit code** - Fix bugs or add new features
- **🎨 Share designs** - Contribute themes, layouts, or UI improvements
- **🧪 Test widgets** - Help test new releases and report issues

### Before You Start

1. **Check existing issues** - Someone might already be working on it
2. **Read the documentation** - Understand how widgets work
3. **Test locally** - Make sure your changes work on your device
4. **Follow our guidelines** - Keep code clean and well-documented

## 📋 Development Process

We use GitHub Flow, so all code changes happen through pull requests:

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Pull Request Process

1. **Update documentation** for any new features
2. **Add tests** if applicable
3. **Ensure code follows** our style guidelines
4. **Update the README** if needed
5. **One feature/fix per PR** - keep changes focused

## 🐛 Bug Reports

Great bug reports tend to have:

- **A quick summary** and/or background
- **Steps to reproduce** - be specific!
- **What you expected** would happen
- **What actually happens**
- **Screenshots** if applicable
- **Device info** (iOS version, device model)
- **Widget configuration** (remove sensitive data)

### Bug Report Template

```markdown
**Bug Description**
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

**Device Info:**
- Device: [e.g. iPhone 12]
- OS: [e.g. iOS 15.0]
- Scriptable Version: [e.g. 1.7.0]
- Widget: [e.g. Weather Widget v2.0]

**Additional Context**
Any other context about the problem.
```

## ✨ Feature Requests

We love new ideas! When suggesting features:

- **Explain the problem** you're trying to solve
- **Describe your solution** in detail
- **Consider alternatives** you've thought about
- **Provide examples** or mockups if helpful

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Screenshots, mockups, or examples.
```

## 💻 Code Contributions

### Setting Up Development Environment

1. **Fork and clone** the repository
2. **Install Scriptable** on your iOS device
3. **Set up test data** (API keys, etc.)
4. **Create a development branch**

### Code Style Guidelines

#### JavaScript Standards

- **Use ES6+ features** where appropriate
- **Consistent indentation** (2 spaces)
- **Meaningful variable names**
- **Comment complex logic**
- **Error handling** for API calls

#### Widget-Specific Guidelines

```javascript
// Good: Clear configuration section
const CONFIG = {
  apiKey: "your_api_key_here",
  refreshInterval: 30,
  theme: "dark"
};

// Good: Error handling
try {
  const data = await fetchWeatherData();
  displayWeather(data);
} catch (error) {
  displayError("Unable to fetch weather data");
}

// Good: Meaningful function names
function createWeatherWidget(data) {
  // Implementation
}
```

#### Documentation Standards

- **Clear setup instructions**
- **Configuration examples**
- **Troubleshooting section**
- **Screenshots or examples**
- **API requirements**

### Testing Your Changes

Before submitting:

1. **Test on actual device** - Simulators don't show widgets
2. **Test different widget sizes** if applicable
3. **Test error conditions** (no internet, invalid API keys)
4. **Verify configuration options** work as expected
5. **Check performance** - avoid memory leaks or excessive API calls

## 📝 Documentation Contributions

### Areas That Need Help

- **Widget setup guides** - Step-by-step instructions
- **Troubleshooting** - Common issues and solutions
- **Configuration examples** - Sample setups and customizations
- **Best practices** - Tips for optimal widget usage
- **Translations** - Help make docs accessible globally

### Documentation Style Guide

- **Be clear and concise**
- **Use step-by-step instructions**
- **Include code examples**
- **Add screenshots when helpful**
- **Test instructions yourself**

## 🎨 Design Contributions

### UI/UX Improvements

- **Color schemes** and themes
- **Layout optimizations**
- **Accessibility improvements**
- **Icon and emoji suggestions**
- **Visual design enhancements**

### Design Guidelines

- **iOS-native look and feel**
- **Respect system themes** (dark/light mode)
- **Accessibility compliance**
- **Performance optimization**
- **Consistency across widgets**

## 🔍 Code Review Process

### What We Look For

- **Functionality** - Does it work as intended?
- **Code quality** - Is it readable and maintainable?
- **Performance** - Is it efficient and fast?
- **Documentation** - Are changes properly documented?
- **Testing** - Has it been thoroughly tested?

### Review Timeline

- **Initial response**: Within 48 hours
- **Full review**: Within 1 week
- **Feedback incorporation**: Ongoing discussion
- **Merge decision**: After all concerns addressed

## 🏷️ Release Process

### Versioning

We use semantic versioning:

- **MAJOR** - Breaking changes
- **MINOR** - New features, backwards compatible
- **PATCH** - Bug fixes, backwards compatible

### Release Schedule

- **Bug fixes** - Released as needed
- **Minor features** - Monthly releases
- **Major updates** - Quarterly releases

## 🎖️ Recognition

### Contributors

All contributors are recognized in:

- **README.md** - Contributors section
- **Release notes** - Feature/fix attribution
- **Documentation** - Author credits where appropriate

### Maintainers

Active contributors may be invited to become maintainers with:

- **Commit access** to the repository
- **Review privileges** for pull requests
- **Release responsibilities**
- **Community leadership** roles

## 📞 Getting Help

### Questions?

- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and feature requests
- **Code reviews** - Feedback on specific contributions

### Contact

- **Repository**: [Scriptable-IOSWidgets](https://github.com/rushhiii/Scriptable-IOSWidgets)
- **Maintainer**: [@rushhiii](https://github.com/rushhiii)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You!

Your contributions make this project better for everyone. Whether you're fixing a typo or adding a major feature, every contribution is valued and appreciated!

**Ready to contribute?** Check out our [open issues](https://github.com/rushhiii/Scriptable-IOSWidgets/issues) or start a [discussion](https://github.com/rushhiii/Scriptable-IOSWidgets/discussions) about your ideas!
