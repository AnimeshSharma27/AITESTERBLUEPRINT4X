import dotenv from 'dotenv';

dotenv.config();

export const TestData = {
  // Valid credentials
  validCredentials: {
    email: process.env.VALID_EMAIL || 'test.user@vwo.com',
    password: process.env.VALID_PASSWORD || 'SecurePass123!@#',
  },
  validCredentials2: {
    email: process.env.VALID_EMAIL_2 || 'qa.engineer@example.com',
    password: process.env.VALID_PASSWORD_2 || 'TestPass456!@#',
  },

  // Invalid credentials
  invalidCredentials: {
    email: process.env.INVALID_EMAIL || 'nonexistent@example.com',
    password: 'WrongPassword123',
  },
  lockedAccount: {
    email: process.env.LOCKED_EMAIL || 'locked.user@vwo.com',
    password: 'AnyPassword123',
  },
  mfaAccount: {
    email: process.env.MFA_EMAIL || 'mfa.user@vwo.com',
    password: 'SecurePass123!@#',
  },

  // Invalid email formats
  invalidEmailFormats: [
    'invalidformat',
    '@example.com',
    'user@',
    'user @domain.com',
    'user@domain',
    'user..name@domain.com',
    'user@domain..com',
    'user@domain.c',
  ],

  // Valid email formats
  validEmailFormats: [
    'standard.user@company.com',
    'user+tag@company.co.uk',
    'user.name.long@subdomain.company.com',
    'user_name@domain.com',
    'user123@example.org',
  ],

  // Security test data
  sqlInjectionPayloads: [
    "admin' OR '1'='1",
    '" OR 1=1 --',
    "' OR 'x'='x",
    "admin' --",
    "1' UNION SELECT * FROM users --",
  ],

  xssPayloads: [
    "<script>alert('XSS')</script>",
    '<img src=x onerror=alert("XSS")>',
    '"><script>alert(String.fromCharCode(88,83,83))</script>',
    '<svg onload=alert("XSS")>',
    'javascript:alert("XSS")',
    '<iframe src="javascript:alert(\'XSS\')"></iframe>',
  ],

  // Password test data
  passwordsWithSpecialChars: [
    'P@ssw0rd!#$%',
    'MySecurePass123!',
    'Test@Pass#2024',
    'Secure!Pass$Word',
  ],

  weakPasswords: [
    '123456',
    'password',
    'qwerty',
    '12345678',
    'abc123',
  ],

  // Boundary test data
  boundaryData: {
    veryLongEmail: 'a'.repeat(500) + '@example.com',
    veryLongPassword: 'p'.repeat(500),
    emptyString: '',
    whitespaceOnly: '   ',
    specialCharsOnly: '!@#$%^&*()',
  },

  // Error message expected values
  expectedErrors: {
    emailRequired: {
      patterns: ['Email is required', 'Please enter your email', 'email'],
    },
    passwordRequired: {
      patterns: ['Password is required', 'Please enter your password', 'password'],
    },
    invalidEmail: {
      patterns: ['Please enter a valid email', 'Invalid email format', 'valid email'],
    },
    invalidCredentials: {
      patterns: ['Invalid email or password', 'Login failed', 'incorrect'],
    },
    accountLocked: {
      patterns: ['Account is locked', 'too many attempts', 'temporarily locked'],
    },
    tooManyAttempts: {
      patterns: ['Too many failed attempts', 'try again later', 'rate limit'],
    },
  },

  // Timeouts and waits
  timeouts: {
    short: 2000,
    medium: 5000,
    long: 10000,
    veryLong: 30000,
    pageLoad: parseInt(process.env.PAGE_LOAD_TIMEOUT || '2000'),
    waitValidation: 1000,
  },

  // URLs
  urls: {
    baseUrl: process.env.BASE_URL || 'https://app-staging.vwo.com',
    loginUrl: process.env.LOGIN_URL || 'https://app-staging.vwo.com/#/login',
    dashboardUrl: 'https://app-staging.vwo.com/#/dashboard',
    forgotPasswordUrl: process.env.FORGOT_PASSWORD_URL || 'https://app-staging.vwo.com/#/forgot-password',
    signUpUrl: process.env.SIGNUP_URL || 'https://app-staging.vwo.com/#/sign-up',
  },

  // Performance thresholds
  performance: {
    pageLoadTarget: 2000, // milliseconds
    firstContentfulPaint: 2000,
    timeToInteractive: 3000,
  },

  // Accessibility
  accessibility: {
    minContrastRatio: 4.5,
    minTouchTargetSize: 44,
  },

  // Session
  session: {
    inactivityTimeout: parseInt(process.env.INACTIVITY_TIMEOUT || '1800000'),
    rememberMeDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // Security configurations
  security: {
    rateLimitThreshold: parseInt(process.env.RATE_LIMIT_THRESHOLD || '5'),
    rateLimitWaitTime: parseInt(process.env.RATE_LIMIT_WAIT_TIME || '900000'),
  },

  // Browser configurations
  browsers: ['chrome', 'firefox', 'webkit'],
  mobileDevices: ['iPhone 12', 'Pixel 5', 'iPad Pro'],

  // Test tags
  tags: {
    critical: '@critical',
    high: '@high',
    medium: '@medium',
    low: '@low',
    smoke: '@smoke',
    regression: '@regression',
    security: '@security',
    accessibility: '@accessibility',
    performance: '@performance',
  },
};
