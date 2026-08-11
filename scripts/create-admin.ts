// scripts/create-admin.ts
import 'dotenv/config'                  

import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function createAdmin() {
  const email = 'admin@bankingsim.com'
  const password = process.env.ADMIN_SEED_PASSWORD
  if (!password) throw new Error('Set ADMIN_SEED_PASSWORD before running this script')

  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  })

  if (existingAdmin) {
    console.log('Admin already exists!')
    console.log('Email:', email)
    console.log('Role:', existingAdmin.role)

    if (existingAdmin.role !== 'ADMIN') {
      await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
      })
      console.log('✅ Role updated to ADMIN')
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await prisma.user.update({
      where: { email },
      data: { passwordHash }
    })
    console.log('✅ Password reset')
  } else {
    const passwordHash = await bcrypt.hash(password, 12)

    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'ADMIN',
        emailVerified: new Date(),
        status: 'ACTIVE',
        profile: {
          create: {
            firstName: 'System',
            lastName: 'Admin',
            dateOfBirth: new Date('1990-01-01'),
            gender: 'OTHER',
            maritalStatus: 'SINGLE',
            nationality: 'System',
            phoneNumber: '+1234567890',
            verificationStatus: 'APPROVED',
            residencyStatus: 'CITIZEN',
          }
        }
      }
    })

    console.log('✅ Admin user created!')
    console.log('Email:', email)
    console.log('Role:', admin.role)
  }

  const allUsers = await prisma.user.findMany()
  console.log('\nAll users in database:')
  allUsers.forEach(user => {
    console.log(`- ${user.email} (${user.role})`)
  })
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect())