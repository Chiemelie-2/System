// components/forms/AccountSelector.tsx
'use client'

interface AccountSelectorProps {
  accounts: Array<{
    id: string
    accountNumber: string
    accountType: string
    balance: number
    user: {
      profile: {
        firstName: string
        lastName: string
      } | null
    }
  }>
  selectedId?: string
  onSelect: (id: string) => void
  error?: string
  label?: string
}

export function AccountSelector({ 
  accounts, 
  selectedId, 
  onSelect, 
  error,
  label = 'Select Account' 
}: AccountSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {accounts.map((account) => (
          <button
            key={account.id}
            type="button"
            onClick={() => onSelect(account.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedId === account.id
                ? 'border-primary-500 bg-primary-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {account.user.profile 
                    ? `${account.user.profile.firstName} ${account.user.profile.lastName}`
                    : 'Unknown Account'
                  }
                </p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  {account.accountNumber}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {account.accountType.toLowerCase()}
                </p>
              </div>
              {selectedId === account.id && (
                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}