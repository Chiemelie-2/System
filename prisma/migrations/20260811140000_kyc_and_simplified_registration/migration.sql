-- Simplified registration: personal details are no longer collected up front.
ALTER TABLE "customer_profiles" ALTER COLUMN "dateOfBirth" DROP NOT NULL;
ALTER TABLE "customer_profiles" ALTER COLUMN "gender" DROP NOT NULL;
ALTER TABLE "customer_profiles" ALTER COLUMN "maritalStatus" DROP NOT NULL;
ALTER TABLE "customer_profiles" ALTER COLUMN "nationality" DROP NOT NULL;
ALTER TABLE "customer_profiles" ALTER COLUMN "phoneNumber" DROP NOT NULL;

-- In-app KYC
CREATE TYPE "KycDocumentType" AS ENUM ('DRIVERS_LICENSE', 'ID_CARD');
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

CREATE TABLE "kyc_documents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" "KycDocumentType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "rejectReason" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kyc_documents_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "kyc_documents_userId_key" ON "kyc_documents"("userId");
CREATE INDEX "kyc_documents_status_idx" ON "kyc_documents"("status");

ALTER TABLE "kyc_documents" ADD CONSTRAINT "kyc_documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
