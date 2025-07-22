# API Vault

> **Secure, elegant API key management for modern development teams**  
> Built with Next.js, Prisma, DaisyUI, and Framer Motion

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-4.0-5A0EF8?logo=daisyui&logoColor=white)](https://daisyui.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🔐 Overview

API Vault is a modern, secure, and intuitive web application designed for developers and teams to safely store, manage, and organize their API credentials. Built with enterprise-grade security and a focus on user experience, API Vault provides a centralized solution for API key management with zero-knowledge encryption.

**🚀 [Live Demo](https://api-vault.vercel.app) | 📖 [Documentation](https://docs.api-vault.dev) | 💬 [Discord](https://discord.gg/api-vault)**

---

## ✨ Features

### 🛡️ Security First
- **AES-256 Encryption** - Military-grade encryption for all stored API keys
- **Zero-Knowledge Architecture** - Your keys are encrypted client-side before storage
- **Secure Authentication** - NextAuth.js integration with multiple providers
- **Role-Based Access Control** - Team collaboration with granular permissions
- **Audit Logging** - Complete activity tracking and security monitoring

### 🎨 Modern User Experience
- **Intuitive Dashboard** - Clean, professional interface built with DaisyUI
- **Theme System** - 15+ built-in themes with real-time switching
- **Responsive Design** - Perfect experience across all devices
- **Smooth Animations** - Framer Motion powered micro-interactions
- **Progressive Web App** - Installable with offline capabilities

### 🚀 Developer Features
- **Multi-Environment Support** - Separate keys for development, staging, and production
- **Smart Organization** - Tag-based filtering and advanced search
- **Quick Access** - One-click key copying with security warnings
- **Usage Analytics** - Track key usage patterns and access history
- **Export/Import** - Backup and migrate your key collections

### 🔧 Management Tools
- **Bulk Operations** - Manage multiple keys simultaneously
- **Expiration Alerts** - Automatic notifications for expiring keys
- **Team Sharing** - Secure key sharing with temporary access links
- **Integration Ready** - REST API for third-party integrations
- **Backup & Recovery** - Automated backups with point-in-time recovery

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, DaisyUI |
| **Backend** | Next.js API Routes, Prisma ORM, PostgreSQL |
| **Authentication** | NextAuth.js (Email, Google, GitHub) |
| **Styling** | TailwindCSS, DaisyUI, Framer Motion |
| **Security** | AES-256 encryption, bcrypt, CSRF protection |
| **Development** | ESLint, Prettier, Jest, React Testing Library |
| **Deployment** | Vercel, Docker support |

---

## 📸 Screenshots

<details>
<summary>🌙 Dark Theme Dashboard</summary>

![Dark Theme Dashboard](screenshots/dashboard-dark.png)
</details>

<details>
<summary>☀️ Light Theme Dashboard</summary>

![Light Theme Dashboard](screenshots/dashboard-light.png)
</details>

<details>
<summary>🎨 Theme Switcher</summary>

![Theme Switcher](screenshots/theme-switcher.gif)
</details>

<details>
<summary>📱 Mobile Responsive</summary>

![Mobile View](screenshots/mobile-view.png)
</details>

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **PostgreSQL 13+**
- **Git**

### Installation

1. **Clone the repository**
```
git clone https://github.com/yourusername/api-vault.git
cd api-v
```

2. **Install dependencies**
```
npm install
```
OR
```
yarn install
```
OR
```
pnpm install
```

3. **Environment setup**
```
cp .env.example .env.local
```

4. **Configure environment variables**

DATABASE_URL="postgresql://username:password@localhost:5432/api_vault"

NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

Encryption
ENCRYPTION_KEY="your-32-character-encryption-key"

---

## 🎯 Usage Guide

### Getting Started
1. **Create Account** - Sign up with email or OAuth provider
2. **Add First Key** - Click "Add API Key" to store your first credential
3. **Organize** - Use tags and environments to organize your keys
4. **Secure Access** - View keys only when needed with one-click reveal

### Security Best Practices
- **Environment Separation** - Use different environments for dev/staging/prod keys
- **Regular Rotation** - Set expiration dates and rotate keys regularly
- **Minimal Access** - Only reveal keys when absolutely necessary
- **Team Collaboration** - Share keys securely with team members using temporary links

### Advanced Features
- **Bulk Operations** - Select multiple keys for batch actions
- **Export/Import** - Backup your keys or migrate between instances
- **Analytics** - Monitor key usage patterns and identify unused keys
- **API Integration** - Use REST API for programmatic access

---

## 🎨 Customization

### Available Themes
API Vault supports 15+ built-in DaisyUI themes:

| Light Themes | Dark Themes | Colorful Themes |
|--------------|-------------|-----------------|
| Light | Dark | Cyberpunk |
| Corporate | Night | Synthwave |
| Winter | Dracula | Valentine |
| Garden | Business | Retro |
| Lofi | Coffee | Aqua |

### Design System
- **Colors** - Semantic color system with theme support
- **Typography** - Professional font hierarchy with Inter
- **Spacing** - Consistent 8px grid system
- **Components** - Reusable component library
- **Animations** - Smooth micro-interactions with Framer Motion

---

## 🔧 API Reference

### Authentication
- POST /api/auth/signin # Sign in user
- POST /api/auth/signup # Register new user
- POST /api/auth/signout # Sign out user
- GET /api/auth/session # Get current session

### API Key Management
- GET /api/keys # List user's API keys
- POST /api/keys # Create new API key
- PUT /api/keys/:id # Update API key
- DELETE /api/keys/:id # Delete API key
- POST /api/keys/:id/reveal # Reveal encrypted key
- GET /api/keys/stats # Get usage statistics


### User Management
- GET /api/user/profile # Get user profile
- PUT /api/user/profile # Update user profile
- GET /api/user/analytics # Get user analytics
- DELETE /api/user/account # Delete user account


---

## 🚀 Deployment

### Vercel (Recommended)
1. **Fork this repository**
2. **Connect to Vercel**
3. **Add environment variables in Vercel dashboard**
4. **Deploy automatically on push**
---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. **Fork the repository**
2. **Create a feature branch** - `git checkout -b feature/amazing-feature`
3. **Make your changes** - Follow the coding standards
4. **Add tests** - Ensure good test coverage
5. **Commit your changes** - Use conventional commits
6. **Push to the branch** - `git push origin feature/amazing-feature`
7. **Open a Pull Request** - We'll review it promptly

### Code Standards
- **ESLint** - Enforced code quality rules
- **Prettier** - Consistent code formatting
- **TypeScript** - Strict type checking enabled
- **Conventional Commits** - Standardized commit messages
- **Husky** - Pre-commit hooks for quality assurance

### Areas for Contribution
- 🐛 **Bug fixes** - Help us squash bugs
- ✨ **New features** - Implement requested features
- 📚 **Documentation** - Improve docs and examples
- 🎨 **UI/UX** - Design improvements and themes
- 🧪 **Testing** - Increase test coverage
- 🌐 **Translations** - Add internationalization support

---

## 📈 Roadmap

### Q1 2025
- [ ] **Mobile Apps** - React Native iOS/Android apps
- [ ] **Team Workspaces** - Enhanced collaboration features
- [ ] **Advanced Analytics** - Detailed usage insights
- [ ] **API Webhooks** - Real-time notifications

### Q2 2025
- [ ] **Enterprise SSO** - SAML/OIDC integration
- [ ] **Compliance Dashboard** - SOC 2, GDPR reporting
- [ ] **Key Rotation Automation** - Scheduled key updates
- [ ] **Advanced Audit Logs** - Detailed security logging

### Q3 2025
- [ ] **Browser Extension** - Quick key access
- [ ] **CLI Tool** - Command-line interface
- [ ] **Terraform Provider** - Infrastructure as code
- [ ] **GraphQL API** - Alternative API interface

### Q4 2025
- [ ] **Multi-Tenant SaaS** - White-label solution
- [ ] **Advanced Encryption** - Post-quantum cryptography
- [ ] **Backup Encryption** - End-to-end backup security
- [ ] **Compliance Automation** - Automated security scans

---

## 🛡️ Security

### Reporting Security Issues
If you discover a security vulnerability, please send an email to aatechax@gmail.com.

### Security Features
- **AES-256 Encryption** - All keys encrypted at rest
- **Zero-Knowledge Architecture** - Server never sees plaintext keys
- **CSRF Protection** - Built-in Next.js protection
- **Rate Limiting** - API endpoints are rate limited
- **Secure Headers** - Security headers configured
- **Regular Updates** - Dependencies updated regularly

### Security Audits
- **Automated Scanning** - Dependabot and CodeQL
- **Manual Reviews** - Regular security assessments
- **Penetration Testing** - Quarterly security testing
- **Compliance** - SOC 2 Type II ready

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
