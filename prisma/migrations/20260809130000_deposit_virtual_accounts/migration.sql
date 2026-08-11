-- AlterEnum
-- New values only. Postgres does not allow dropping/renaming enum values
-- without rewriting the type, and the app no longer assigns PENDING to new
-- rows, so it is left in place rather than removed.
ALTER TYPE "DepositRequestStatus" ADD VALUE 'AWAITING_PAYMENT';
ALTER TYPE "DepositRequestStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "DepositRequestStatus" ADD VALUE 'EXPIRED';
ALTER TYPE "DepositRequestStatus" ADD VALUE 'CANCELLED';

-- CreateTable
CREATE TABLE "deposit_destination_accounts" (
    "id" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deposit_destination_accounts_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "deposit_requests"
    ADD COLUMN "destinationAccountId" TEXT,
    ADD COLUMN "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN "customerConfirmedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "deposit_requests_destinationAccountId_idx" ON "deposit_requests"("destinationAccountId");

-- AddForeignKey
ALTER TABLE "deposit_requests" ADD CONSTRAINT "deposit_requests_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES "deposit_destination_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;