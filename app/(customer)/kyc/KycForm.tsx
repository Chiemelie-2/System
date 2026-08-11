// app/(customer)/kyc/KycForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { FileUpload } from '@/components/ui/FileUpload'
import { submitKycDocument } from '@/features/kyc/actions'

export function KycForm() {
  const router = useRouter()
  const [documentType, setDocumentType] = useState<'DRIVERS_LICENSE' | 'ID_CARD'>('DRIVERS_LICENSE')
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Select a document image first')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('documentType', documentType)
      formData.append('document', file)

      const result = await submitKycDocument(formData)
      if (result.success) {
        toast.success(result.message || 'Document uploaded')
        setFile(null)
        router.refresh()
      } else {
        toast.error(result.error || 'Upload failed')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Document Type</label>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value as 'DRIVERS_LICENSE' | 'ID_CARD')}
          className="input-field"
        >
          <option value="DRIVERS_LICENSE">Driver&apos;s License</option>
          <option value="ID_CARD">ID Card</option>
        </select>
      </div>

      <FileUpload
        label="Upload document image"
        accept="image/*"
        maxSize={5}
        onFileSelect={setFile}
      />

      <Button className="w-full" onClick={handleSubmit} isLoading={isSubmitting} disabled={!file}>
        Submit for Verification
      </Button>
    </div>
  )
}
