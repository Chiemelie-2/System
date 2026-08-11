# 🏦 BankingSim - Digital Banking Simulation Platform

A professional, enterprise-grade digital banking simulation platform built with Next.js 16, designed for portfolio demonstration and educational purposes.

![BankingSim](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## ✨ Features

### Customer Features
- 📝 **Multi-Step Registration** - 7-step KYC onboarding with validation
- 📧 **Email Verification** - Secure email verification flow
- 🔐 **Authentication** - Login/logout with password reset
- 📊 **Dashboard** - Real-time account overview with balance
- 💳 **Account Management** - View account details and transaction history
- 📸 **Document Upload** - Profile photo and ID upload with Cloudinary
- 📱 **Responsive Design** - Mobile-first, works on all devices

### Admin Features
- 📈 **Admin Dashboard** - Key metrics and recent activity
- 👥 **User Management** - View, search, suspend/activate users
- ✅ **KYC Verification** - Approve/reject customer applications
- 💰 **Balance Management** - Add/deduct virtual funds
- 📝 **Audit Logging** - Complete audit trail of all admin actions
- 🔍 **Transaction History** - View all platform transactions

### Technical Features
- ⚡ **Server Components** - Optimal performance with React Server Components
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔒 **Security** - Rate limiting, CSRF protection, input validation
- 📧 **Email Integration** - Resend for transactional emails
- 📤 **File Uploads** - Cloudinary for image storage
- 🗄️ **PostgreSQL** - Prisma ORM with Supabase
- 🚀 **Vercel Ready** - Optimized for Vercel deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Cloudinary account (free tier)
- Resend account (free tier)

### Installation

1. **Clone and install dependencies:**
\`\`\`bash
git clone <repository-url>
cd banking-sim
npm install
\`\`\`

2. **Set up environment variables:**
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your credentials
\`\`\`

3. **Set up the database:**
\`\`\`bash
npx prisma db push
npx prisma generate
npm run db:seed
\`\`\`

4. **Start the development server:**
\`\`\`bash
npm run dev
\`\`\`

5. **Open [http://localhost:3000](http://localhost:3000)**

### Default Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bankingsim.com | Admin@123 |
| User | user@example.com | User@1234 |

## 📁 Project Structure

\`\`\`
banking-sim/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (customer)/        # Customer dashboard
│   ├── (admin)/           # Admin panel
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── dashboard/        # Dashboard components
│   ├── admin/            # Admin components
│   └── layout/           # Layout components
├── features/             # Feature-specific logic
│   ├── auth/            # Authentication logic
│   ├── registration/    # Registration flow
│   ├── accounts/        # Account management
│   └── admin/           # Admin functionality
├── lib/                  # Core utilities
│   ├── prisma.ts        # Database client
│   ├── auth.ts          # Auth configuration
│   ├── resend.ts        # Email service
│   ├── cloudinary.ts    # File upload service
│   └── utils.ts         # Helper functions
└── prisma/              # Database schema
\`\`\`

## 🔧 Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Auth.js secret (min 32 chars) |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RESEND_API_KEY` | Resend API key |
| `NEXT_PUBLIC_APP_URL` | Application URL |

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: Auth.js v5
- **Styling**: Tailwind CSS
- **Email**: Resend
- **File Storage**: Cloudinary
- **Animation**: Framer Motion
- **Validation**: Zod
- **Forms**: React Hook Form
- **Deployment**: Vercel

## 🧪 Testing

\`\`\`bash
# Type checking
npm run type-check

# Linting
npm run lint

# Manual testing flow
# See scripts/test-flow.md
\`\`\`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

BankingSim is a **simulation platform** designed for portfolio demonstration and educational purposes only. 

- ❌ No real financial transactions are processed
- ❌ No real money is held or transferred
- ❌ This is not a real bank
- ❌ Not FDIC insured
- ✅ Built for demonstration and education

---

Built with ❤️ using Next.js


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
