// components/dashboard/AccountInfoPanel.tsx
// ── New file. Path: app-src/components/dashboard/AccountInfoPanel.tsx ──

interface AccountInfoPanelProps {
  accountNumber: string
  routingNumber: string
  accountType: string
  status: string
}

export function AccountInfoPanel({
  accountNumber,
  routingNumber,
  accountType,
  status,
}: AccountInfoPanelProps) {
  const rows = [
    { label: 'Account No.', value: accountNumber, mono: true },
    { label: 'Routing No.', value: routingNumber, mono: true },
    { label: 'Account Type', value: accountType.charAt(0) + accountType.slice(1).toLowerCase() },
    { label: 'Status', value: null, status },
  ]

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-50">
        <h3 className="font-display font-bold text-[15px] text-primary-900">Account Info</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">Your account details</p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide flex-shrink-0">
              {row.label}
            </p>
            {row.status ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
                               text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                {row.status.charAt(0) + row.status.slice(1).toLowerCase()}
              </span>
            ) : (
              <p
                className={`text-[12px] font-semibold text-gray-800 text-right break-all
                  ${row.mono ? 'font-mono' : ''}`}
              >
                {row.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* View routing details link */}
      <div className="px-5 pb-5">
        <div className="mt-2 p-4 rounded-xl bg-primary-50 border border-primary-100">
          <p className="text-[11px] font-semibold text-primary-700 mb-1">
            Need your full details?
          </p>
          <p className="text-[11px] text-primary-600 leading-relaxed">
            Tap the account number or routing number on the card above to copy it instantly.
          </p>
        </div>
      </div>
    </div>
  )
}