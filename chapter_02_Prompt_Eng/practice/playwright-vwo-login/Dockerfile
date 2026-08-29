# Multi-stage Dockerfile for VWO Login Playwright Tests

# Stage 1: Dependencies
FROM mcr.microsoft.com/playwright:v1.40.0-focal AS dependencies

WORKDIR /app

# Install Node.js dependencies
COPY package*.json ./
RUN npm ci

# Stage 2: Test execution
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Install system dependencies for better performance
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd -m -u 1000 playwright && \
    chown -R playwright:playwright /app

USER playwright

# Set environment variables
ENV CI=true
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV LANG=en_US.UTF-8

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD test -f /tmp/playwright_ready || exit 1

# Default command - runs all tests
CMD ["npm", "test"]

# Usage:
# 1. Build image: docker build -t vwo-login-tests .
# 2. Run all tests: docker run --rm vwo-login-tests
# 3. Run specific test: docker run --rm vwo-login-tests npm run test:positive
# 4. Run with environment file: docker run --rm --env-file .env vwo-login-tests
# 5. Mount results: docker run --rm -v $(pwd)/test-results:/app/test-results vwo-login-tests
