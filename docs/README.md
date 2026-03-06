# 📚 Test Framework Documentation

Welcome to the GC3 → GC2 Test Framework documentation! This guide will help you get started quickly and understand the full capabilities of the framework.

## 📖 Documentation Structure

### 🚀 Getting Started (Start Here!)

1. **[QUICK_START.md](QUICK_START.md)** ⭐ **Start here!**
   - 5-minute quick start guide
   - Add your first test in under 5 minutes
   - Common scenario templates
   - Quick reference tables
   - **Time needed:** 5 minutes

2. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)**
   - What was built and why
   - Key benefits and statistics
   - File structure overview
   - Next steps and tips
   - **Time needed:** 10 minutes

### 📘 Complete Reference

3. **[TEST_FRAMEWORK_GUIDE.md](TEST_FRAMEWORK_GUIDE.md)**
   - Complete framework documentation
   - All action and verification types
   - Configuration options
   - Common patterns and examples
   - Troubleshooting guide
   - Extension guide
   - **Time needed:** 20-30 minutes

### 🔄 Migration & Maintenance

4. **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)**
   - Converting old tests to new framework
   - Step-by-step migration process
   - Before/after examples
   - Conversion reference tables
   - **Time needed:** 15 minutes

### 🏗️ Architecture & Design

5. **[ARCHITECTURE.md](ARCHITECTURE.md)**
   - System architecture diagrams
   - Component interactions
   - Data flow visualization
   - Extension points
   - Design principles
   - **Time needed:** 10 minutes

---

## 🎯 Quick Navigation

### By Role

**👨‍💻 I'm a Test Developer (New to the Framework)**
→ Start with [QUICK_START.md](QUICK_START.md), then [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

**🔧 I Need to Add Test Cases**
→ Go to [QUICK_START.md](QUICK_START.md) → "Common Scenarios" section

**📚 I Want to Understand Everything**
→ Read [TEST_FRAMEWORK_GUIDE.md](TEST_FRAMEWORK_GUIDE.md)

**🔄 I'm Migrating Old Tests**
→ Follow [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

**🏗️ I Want to Extend the Framework**
→ Read [ARCHITECTURE.md](ARCHITECTURE.md) + [TEST_FRAMEWORK_GUIDE.md](TEST_FRAMEWORK_GUIDE.md#-extending-the-framework)

**🐛 I'm Having Issues**
→ Check [TEST_FRAMEWORK_GUIDE.md](TEST_FRAMEWORK_GUIDE.md#-troubleshooting)

### By Task

**Task: Add a new test scenario**
1. [QUICK_START.md](QUICK_START.md) - Copy template
2. Customize and run

**Task: Test product reuse logic**
1. [QUICK_START.md](QUICK_START.md) - "Test 2: Product Reuse Test"
2. Set `reuseProducts: true`

**Task: Test price override**
1. [TEST_FRAMEWORK_GUIDE.md](TEST_FRAMEWORK_GUIDE.md#pattern-2-override-testing)
2. Use `override_product_price` action

**Task: Verify business rules**
1. [TEST_FRAMEWORK_GUIDE.md](TEST_FRAMEWORK_GUIDE.md#-business-logic-rules-reference)
2. Pick appropriate verification type

**Task: Convert existing test**
1. [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Step-by-step guide
2. Use conversion reference tables

---

## 🎓 Learning Path

### Level 1: Beginner (30 minutes)
1. Read [QUICK_START.md](QUICK_START.md) - 5 min
2. Run example tests - 5 min
3. Add one simple test - 10 min
4. Skim [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - 10 min

**You'll be able to:** Add basic test scenarios

### Level 2: Intermediate (1-2 hours)
1. Read [TEST_FRAMEWORK_GUIDE.md](TEST_FRAMEWORK_GUIDE.md) - 30 min
2. Try different patterns - 20 min
3. Add 3-5 test scenarios - 30 min
4. Review [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - 15 min

**You'll be able to:** Handle most testing needs, migrate old tests

### Level 3: Advanced (3-4 hours)
1. Deep dive into [ARCHITECTURE.md](ARCHITECTURE.md) - 30 min
2. Study extension examples - 30 min
3. Extend framework with custom actions - 1 hour
4. Create complex nested scenarios - 1 hour
5. Optimize and refactor existing tests - 1 hour

**You'll be able to:** Extend framework, handle any edge case

---

## 📊 Framework Capabilities

### Configuration Options

| Feature | Config Section | Documentation |
|---------|----------------|---------------|
| Products | `setup.products` | [Quick Start](QUICK_START.md#setup-options) |
| Modifier Groups | `setup.modifierGroups` | [Quick Start](QUICK_START.md#setup-options) |
| Nested Chains | `setup.nestedModifierChain` | [Guide](TEST_FRAMEWORK_GUIDE.md#2-setup) |
| Menus | `setup.menu` | [Quick Start](QUICK_START.md#setup-options) |
| Product Reuse | `setup.menu.reuseProducts` | [Guide](TEST_FRAMEWORK_GUIDE.md#pattern-1-product-reuse-testing) |

### Available Actions

| Action | Purpose | Documentation |
|--------|---------|---------------|
| `publish` | Publish menu to GC2 | [Guide](TEST_FRAMEWORK_GUIDE.md#action-types) |
| `override_product_price` | Override price | [Guide](TEST_FRAMEWORK_GUIDE.md#pattern-2-override-testing) |
| `revert_product_price` | Revert price | [Guide](TEST_FRAMEWORK_GUIDE.md#pattern-2-override-testing) |
| More... | ... | [Complete List](TEST_FRAMEWORK_GUIDE.md#-available-action-types) |

### Business Rules Coverage

All 15 business logic rules are implemented and documented:

| Rule # | Description | Verification Type | Documentation |
|--------|-------------|-------------------|---------------|
| 1 | Product reuse | `gc2_product_reused_without_duplicate` | [Rules Reference](TEST_FRAMEWORK_GUIDE.md#-business-logic-rules-reference) |
| 2 | Modifier reuse | `gc2_modifier_group_reused_without_duplicate` | [Rules Reference](TEST_FRAMEWORK_GUIDE.md#-business-logic-rules-reference) |
| 3 | Product override | `gc2_product_duplicated_with_override` | [Rules Reference](TEST_FRAMEWORK_GUIDE.md#-business-logic-rules-reference) |
| ... | ... | ... | [Full List](TEST_FRAMEWORK_GUIDE.md#-business-logic-rules-reference) |

---

## 🔗 External Resources

- **Project README**: `../README_FRAMEWORK.md`
- **Configuration File**: `../cypress/support/test-config/test-scenarios.config.ts`
- **Test Builder**: `../cypress/support/test-builders/scenario-test-builder.ts`
- **Verification Logic**: `../cypress/support/verification-logic/verification-rules.ts`
- **Example Tests**: `../cypress/e2e/scenarios-v2/`

---

## 💡 Best Practices

1. **Start Simple**: Begin with basic scenarios before complex ones
2. **Test Incrementally**: Run tests after each change
3. **Use Descriptive IDs**: Makes debugging easier
4. **Keep Cleanup Accurate**: Match cleanup numbers with setup
5. **Document Edge Cases**: Add comments for unusual scenarios
6. **Leverage TypeScript**: Use autocomplete and type checking
7. **Reuse Configurations**: Copy similar scenarios and modify

---

## 🆘 Getting Help

### Quick Questions
- Check [QUICK_START.md](QUICK_START.md) for common tasks
- Look at example test files in `../cypress/e2e/scenarios-v2/`

### Detailed Information
- Read [TEST_FRAMEWORK_GUIDE.md](TEST_FRAMEWORK_GUIDE.md)
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design

### Migration Help
- Follow [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- Use conversion reference tables

### Troubleshooting
- See [TEST_FRAMEWORK_GUIDE.md](TEST_FRAMEWORK_GUIDE.md#-troubleshooting)
- Check example scenarios in config file

---

## 📈 What's Next?

After reading the documentation:

1. ✅ Add your first test using [QUICK_START.md](QUICK_START.md)
2. ✅ Explore different patterns in [TEST_FRAMEWORK_GUIDE.md](TEST_FRAMEWORK_GUIDE.md)
3. ✅ Start migrating old tests with [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
4. ✅ Extend framework for your specific needs
5. ✅ Share knowledge with your team

---

## 📝 Documentation Maintenance

### Adding New Documentation
When adding new features, update:
- [ ] [TEST_FRAMEWORK_GUIDE.md](TEST_FRAMEWORK_GUIDE.md) - Add to relevant sections
- [ ] [QUICK_START.md](QUICK_START.md) - Add quick reference entry
- [ ] This README - Update tables and navigation
- [ ] Code comments - Keep inline docs up to date

### Documentation Standards
- Use clear, concise language
- Provide code examples
- Include time estimates
- Add visual diagrams where helpful
- Cross-reference related sections

---

**Ready to get started? → [Go to Quick Start Guide](QUICK_START.md) 🚀**

---

*Documentation last updated: 2024*
*Framework version: 1.0.0*
