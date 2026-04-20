-- AlterTable
ALTER TABLE "QuoteRequest" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidAt" TIMESTAMP(3);
