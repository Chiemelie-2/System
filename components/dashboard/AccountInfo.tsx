// components/dashboard/AccountInfo.tsx

interface AccountInfoProps {
  accountNumber?: string
  routingNumber?: string
  customerId?: string
}

export function AccountInfo({
  accountNumber,
  routingNumber,
  customerId,
}: AccountInfoProps) {
  return (
    <div className="p-4 bg-white rounded-lg border">
      <h3 className="font-semibold mb-4">Account Information</h3>

      <div className="space-y-2 text-sm">
        <p>
          <strong>Account Number:</strong> {accountNumber ?? 'N/A'}
        </p>

        <p>
          <strong>Routing Number:</strong> {routingNumber ?? 'N/A'}
        </p>

        <p>
          <strong>Customer ID:</strong> {customerId ?? 'N/A'}
        </p>
      </div>
    </div>
  )
}