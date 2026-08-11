# Manual Testing Flow

## 1. Registration Flow
1. Visit `/register`
2. Complete all 7 steps
3. Verify email (check console for token in dev)
4. Check Prisma Studio for user data

## 2. Admin Approval
1. Login as admin
2. Go to Verifications
3. Approve a pending user
4. Verify account was created
5. Check audit log

## 3. Balance Management
1. Go to Balances
2. Add funds to an account
3. Verify transaction appears
4. Check audit log

## 4. Customer Experience
1. Login as customer
2. View dashboard
3. Check balance
4. View transactions
5. Check profile