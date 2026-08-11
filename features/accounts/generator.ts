// features/accounts/generator.ts
export function generateCustomerId(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `CUS${timestamp}${random}`
}

export function generateAccountNumber(): string {
  // Generate realistic 10-digit account number
  const prefix = ['45', '48', '50', '62'][Math.floor(Math.random() * 4)]
  const digits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')
  return `${prefix}${digits}`
}

export const ROUTING_NUMBER = '091000019' // Static for simulation