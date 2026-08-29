# Quick Start Guide - VWO Login Playwright Tests

Get up and running with the VWO Login test automation framework in **5 minutes**.

---

## 🚀 Installation (2 minutes)

### 1. Prerequisites Check
```bash
# Verify Node.js is installed (v18+)
node --version

# Verify npm is installed (v9+)
npm --version
```

### 2. Install Dependencies
```bash
# Navigate to project directory
cd playwright-vwo-login

# Install all dependencies
npm install
```

### 3. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your test credentials
# Open .env in your editor and update:
VALID_EMAIL=your-test-user@vwo.com
VALID_PASSWORD=your-test-password
```

✅ **Setup Complete!**

---

## 🏃 Running Tests (1 minute)

### Run All Tests
```bash
npm test
```

### Run Test Categories
```bash
# Happy path scenarios
npm run test:positive

# Error handling
npm run test:negative

# Security vulnerabilities
npm run test:security

# Accessibility (WCAG 2.1 AA)
npm run test:accessibility

# Performance (Core Web Vitals)
npm run test:performance
```

### Run with Browser Visible
```bash
npm run test:headed
```

### Interactive UI Mode
```bash
npm run test:ui
```

---

## 📊 View Results (30 seconds)

### HTML Report
```bash
npm run report
```
This opens a detailed report in your browser showing:
- ✅ Passed/Failed tests
- 📸 Screenshots on failure
- 🎥 Video recordings
- ⏱️ Execution time per test

### JSON Results
Check `test-results/results.json` for machine-readable results

### JUnit XML
Check `test-results/junit.xml` for CI/CD integration

---

## 🐛 Debugging (Quick Tips)

### Run Specific Test
```bash
npx playwright test --grep "TC-VALID-001"
```

### Debug Mode (Step Through)
```bash
npm run test:debug
```

### Generate Test Code
```bash
npm run codegen
# 1. Browser opens automatically
# 2. Interact with login page
# 3. Code generates as you interact
```

### View Test Traces
```bash
npm run trace
```

---

## 🐳 Docker Execution (Optional)

### Build Docker Image
```bash
docker build -t vwo-login-tests .
```

### Run Tests in Docker
```bash
docker run --rm vwo-login-tests

# With environment file
docker run --rm --env-file .env vwo-login-tests

# With volume mount for results
docker run --rm -v $(pwd)/test-results:/app/test-results vwo-login-tests
```

### Docker Compose
```bash
# Run all tests
docker-compose up playwright-tests

# View report server
docker-compose --profile with-reports up
# Then visit: http://localhost:8080
```

---

## 📁 Project Structure

```
playwright-vwo-login/
├── tests/
│   ├── positive/         # 15 Happy path tests
│   ├── negative/         # 22 Error handling tests
│   ├── security/         # 12 Security tests
│   ├── accessibility/    # 18 WCAG tests
│   └── performance/      # 18 Performance tests
├── pages/
│   └── LoginPage.ts      # Page Object Model
├── tests/data/
│   └── testdata.ts       # Test data
├── utils/
│   └── helpers.ts        # Utility functions
├── .env.example          # Environment template
└── README.md             # Full documentation
```

---

## ⚡ Common Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests |
| `npm run test:headed` | Run with visible browser |
| `npm run test:ui` | Interactive test UI |
| `npm run report` | View HTML report |
| `npm run test:positive` | Run happy path tests |
| `npm run test:security` | Run security tests |
| `npm run test:debug` | Debug mode |
| `npm run codegen` | Record test code |

---

## ✅ Test Coverage

| Category | Count | Purpose |
|----------|-------|---------|
| Positive | 15 | Valid login scenarios |
| Negative | 22 | Error handling |
| Security | 12 | OWASP vulnerabilities |
| Accessibility | 18 | WCAG 2.1 AA compliance |
| Performance | 18 | Core Web Vitals |
| **Total** | **85+** | Complete coverage |

---

## 🎯 Next Steps

### 1. First Time Users
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Update credentials in `.env`
- [ ] Run `npm test` to verify setup

### 2. View Test Code
- [ ] Open `tests/positive/valid-login.spec.ts`
- [ ] Open `pages/LoginPage.ts`
- [ ] Open `tests/data/testdata.ts`

### 3. Add New Tests
- See [Contributing Guidelines](README.md#contributing-guidelines) in README

### 4. Set Up CI/CD
- Copy `.github/workflows/playwright.yml` to your repo
- Add GitHub secrets for credentials

---

## 🚨 Troubleshooting

### Tests Can't Find Login Page
```bash
# Verify BASE_URL in .env
echo "BASE_URL=https://app.vwo.com" >> .env
```

### Authentication Fails
1. Verify email/password in `.env`
2. Check if 2FA is enabled (disable for test account)
3. Check if account is locked (wait 15 mins)

### Tests Time Out
```typescript
// In playwright.config.ts, increase timeout:
timeout: 60000  // 60 seconds
```

### Need Help?
- Check full README: `README.md`
- View test plan: `VWO_Login_TestPlan.md`
- Review test cases: `VWO_Login_TestCases.md`

---

## 📝 Environment Variables

Required:
- `BASE_URL` - Login page URL (default: https://app.vwo.com)
- `VALID_EMAIL` - Test user email
- `VALID_PASSWORD` - Test user password

Optional:
- `PAGE_LOAD_TARGET` - Max load time in ms (default: 2000)
- `RATE_LIMIT_THRESHOLD` - Failed attempts before lock (default: 5)

---

## 🎓 Learning Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Debugging Tests](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

---

## 💡 Pro Tips

1. **Use UI Mode for Development**
   ```bash
   npm run test:ui
   ```
   Perfect for watching tests run and debugging.

2. **Filter Tests While Writing**
   ```bash
   npx playwright test --grep "VALID"
   ```
   Only runs tests matching the pattern.

3. **Record User Interactions**
   ```bash
   npm run codegen
   ```
   Great for understanding Playwright syntax.

4. **Debug Specific Test**
   ```bash
   npx playwright test tests/positive/valid-login.spec.ts --debug
   ```

5. **View Traces of Failed Tests**
   ```bash
   npm run trace
   ```
   See exactly what happened when test failed.

---

## 🤝 Support

For detailed information, see:
- **Full Documentation**: [README.md](README.md)
- **Test Plan**: [VWO_Login_TestPlan.md](VWO_Login_TestPlan.md)
- **Test Cases**: [VWO_Login_TestCases.md](VWO_Login_TestCases.md)

---

**Happy Testing! 🚀**
