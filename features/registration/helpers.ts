// features/registration/helpers.ts
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function createEmailVerificationToken(userId: string) {
  const token = generateVerificationToken()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  
  await prisma.verificationToken.create({
    data: {
      identifier: userId,
      token,
      expires,
    }
  })
  
  return token
}

export function formatStepData(step: number, data: any) {
  switch (step) {
    case 1:
      return {
        email: data.email,
        password: data.password,
      }
    case 2:
      return {
        firstName: data.firstName,
        middleName: data.middleName || null,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        nationality: data.nationality,
        phoneNumber: data.phoneNumber,
      }
    case 3:
      return {
        idType: data.idType,
        idNumber: data.idNumber,
      }
    case 4:
      return {
        residencyStatus: data.residencyStatus,
        passportNumber: data.passportNumber || null,
        countryOfCitizenship: data.countryOfCitizenship || null,
      }
    case 5:
      return {
        residentialAddress: data.residentialAddress,
        apartmentSuite: data.apartmentSuite || null,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode || null,
      }
    default:
      return data
  }
}