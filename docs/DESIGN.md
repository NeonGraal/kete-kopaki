# Envelope Budget App — Design

## Concept

A personal budgeting app based on the **Envelope Method**: income is divided into named "envelopes", each representing a spending category. Money can only be spent from a specific envelope, making overspending immediately visible.

Envelopes hold a **persistent, running balance** — income flows in as transactions, not as a budget "firing". This means a well-managed envelope accumulates a buffer over time, while chronic overspending is clearly visible in its history.

A **Household** groups budgets, envelopes, and accounts at a single-user level. Envelopes can receive income from multiple sources, and envelope transfers can split or distribute money across multiple recipient envelopes.

---

## Core Entities

### Household

- A named container for budgets, envelopes, and accounts (e.g. "Smith Family Budget")
- Owns all budgets, envelopes, and accounts
- All financial data is household-scoped

### Budget

- A **recurring schedule** for expected income and expenses (e.g. "Weekly Groceries", "Monthly Bills")
- Belongs to a household
- Has a **period** (weekly, fortnightly, monthly, custom) and a **start date**
- Multiple budgets can be **active concurrently** — a household might have a weekly food budget and a monthly bills budget running in parallel
- Each budget specifies scheduled transactions (expenses and income) for each period

### Envelope

- A named spending category (e.g. "Groceries", "Rent", "Fun Money")
- Belongs to a household
- Has a **persistent, running balance** — balances carry over indefinitely; there is no reset
- The balance grows when income is recorded; it shrinks as expenses are recorded
- Can be linked to one or more budgets (a budget may reference it in scheduled transactions)

### Scheduled Transaction

- An expense, income, or transfer expected on a specific date within a budget period
- Remains unposted until the date arrives or is manually confirmed
- Fields: date, amount (fixed or estimated), description, envelope(s), source account, optional payee
- Can be marked as **recurring within the budget** — e.g. "Electricity bill every 15th of the month" if the budget is monthly
- Amount can be set to change on a specific date — e.g. insurance bill increases on 1 June
- Types:
  - **Scheduled Expense** — money leaving one or more envelopes on a future date
  - **Scheduled Income** — money entering one or more envelopes on a future date
  - **Scheduled Transfer** — move money from one or more envelopes to one or more recipient envelopes on a future date

### Transaction

- A posted debit or credit against specific envelopes (historical record)
- Fields: date, amount, description, envelope(s), account, optional payee
- Directly mutable — edits update the transaction in place
- Types:
  - **Expense** — money leaving one or more envelopes (posted)
  - **Income** — money entering one or more envelopes (posted)
  - **Transfer** — move money from one or more source envelopes to one or more recipient envelopes (zero-sum)

### Payee

- A named entity money is paid to
- Remembers the last envelope used → smart defaults

### Account

- Named financial accounts (e.g. "Savings Account", "Visa Card", "Personal Loan")
- Belongs to a household
- **Name** — display name for the account
- **External Number** — account number, card number, or loan reference from the financial institution (for reconciliation)
- **Type**: General, Credit Card, or Loan/Revolving Credit
- Each account tracks a **running balance** (for reporting and reconciliation)
- Transactions post to an account; envelopes are independent of account

#### General Account

- Simple debit account (savings, checking)
- No interest, no special rules

#### Credit Card Account

- Card balance and available credit
- **Interest Tiers** — interest rate changes over time (e.g. promotional rate 0% until 1 June, then 19.99%)
- **Interest calculation method**: per payment, per period, or on unpaid balance (as of a specific date)
- **Scheduled payments** — can set automatic or recurring payment reminders tied to a scheduled transaction
- Tracks revolving balance and minimum payment due

#### Loan / Revolving Credit Account

- Borrowed amount with repayment term
- **Interest Tiers** — interest rate changes over time (e.g. fixed 6.5% for first 2 years, then 7.2%)
- **Interest calculation method**: per payment, per period, or on unpaid balance (as of a specific date)
- **Scheduled payments** — recurring payment schedule (principal + interest)
- Tracks outstanding balance, total owed, and amortization schedule

---

## Key Workflows

### 1. Set Up a Budget (Scheduled Transactions)

1. Create a budget with a name, period (e.g. fortnightly), and start date
2. Add scheduled transactions (income and expenses) for specific dates within the period
3. Each scheduled transaction can target one or multiple envelopes (income splits, multi-envelope transfers)
4. On each scheduled date the transaction posts automatically or notifies (configurable)
5. Multiple budgets with different cadences can run simultaneously

### 2. Record Income

1. Select target envelope(s) — can be a single envelope or split across multiple
2. Enter amount, date, and description
3. Balance(s) update instantly
4. Can be ad-hoc or part of a scheduled budget

### 3. Record an Expense

1. Select source envelope(s) — can be one envelope or split across multiple
2. Enter amount and description
3. Balance(s) update instantly; envelope turns amber (<20% left) or red (overspent)

### 4. Envelope Transfer

- Move money from one or more source envelopes to one or more recipient envelopes at any time (many-to-many)
- Example: split $100 from Savings into Fun Money ($40) and Holiday Fund ($60)
- Keeps a full audit trail

### 5. Manage Scheduled Transactions

- Review upcoming scheduled transactions
- Mark as confirmed, postpone, or adjust amounts
- Can adjust a single period's scheduled amount without changing the recurring schedule

### 6. Review Upcoming Cashflow

1. Select a time range (next 2 weeks, month, quarter, or custom)
2. View a timeline of:

- Scheduled income transactions (inflows to each envelope)Scheduled expenses and transfers (outflows from each envelope)Projected envelope balances after each transaction

Identify periods of low cash (all envelopes approaching zero) or high surplusAdjust scheduled amounts or postpone transactions to smooth cashflowCompare projected balance against known minimum balances needed per envelope

### 7. Analyse Budget Against Actuals and Changes

1. Select a time period to review (completed budget period or year-to-date)
2. View side-by-side:

Scheduled transactions from the budget (planned)Posted transactions (actual)Variance (actual vs planned) per envelope and category

3. Highlight upcoming amount changes (e.g. insurance premium increase, salary change) and their impact
4. Identify recurring over/underspend patterns (e.g. groceries consistently 15% above budget)
5. Optionally adjust next period's scheduled amounts based on trends

---

## Screens / Views

- **Dashboard** — Household envelope grid with running balances, colour-coded health, upcoming scheduled transactions; account balances section showing all accounts with running balances
- **Envelope Detail** — Full transaction history (posted + scheduled), running balance chart
- **Add Income** — Record income to one or more envelopes; recent sources shown
- **Add Expense** — Record expense from an envelope; recent payees shown
- **Transfer** — Move money from one or more source envelopes to one or more recipient envelopes
- **Scheduled Transactions** — List of upcoming transactions (income, expense, transfer); mark confirmed, postpone, or adjust amounts
- **Budget Setup** — Create/edit a recurring budget schedule; add scheduled transactions for specific dates within each period
- **Budgets Overview** — All active and paused budgets; next scheduled dates; period contribution totals
- **Amount Changes** — Manage date-based amount changes (e.g. insurance increase on 1 June)
- **Reports** — Spending trends by envelope, period comparisons, actual vs estimated
- **Household Settings** — Manage accounts, notification preferences

---

## Dashboard Layout

```javascript
┌──────────────────────────────────────────────────────┐
│  🏡 Smith Household              June 2026           │
├──────────────────────────────────────────────────────┤
│  Upcoming Scheduled Transactions                     │
│  📆 Tue 18 Jun  Electricity  -$120  (Est.)  ⚠️ Exp  │
│  📆 Wed 19 Jun  Income       +$1,500 ✓ Confirmed   │
│  📆 Fri 21 Jun  Groceries    -$150  ⚠️ Est. (±$20)  │
│  📆 Sat 22 Jun  Transfer     $100→Fun  $200→Savings │
├──────────────────────────────────────────────────────┤
│  Accounts                                  Balance   │
│  🏦 Cheque Account     (***1234)          $2,150     │
│  💳 Visa Card          (***5678)          $1,245 ↑   │
│  💰 Personal Loan      (***9012)          -$8,500    │
├──────────────────────────────────────────────────────┤
│  Envelopes                         Balance           │
│  🏠 Rent              ████ FULL    $1,500            │
│  🛒 Groceries         ████░░░░     $420              │
│  ⛽ Transport         ██░░░░░░     $85               │
│  🎉 Fun Money         ░░░░░░░░     -$12   ⚠️ over   │
│  💊 Health            ████░░░░     $60               │
│  💰 Savings           ████████     $2,350            │
└──────────────────────────────────────────────────────┘
```

---

## Envelope States

| State         | Condition                                  | Visual |
| ------------- | ------------------------------------------ | ------ |
| **Healthy**   | > 20% of typical periodic income remaining | Green  |
| **Low**       | 1–20% remaining                            | Amber  |
| **Empty**     | $0 remaining                               | Grey   |
| **Overspent** | Negative balance                           | Red    |

---

## Business Rules

1. **Balances are persistent** — an envelope's balance carries forward indefinitely; there is no period reset. Income adds to it; expenses and transfers subtract.
2. **Budgets are schedules** — a budget defines recurring scheduled transactions (income and expenses) on specific dates. Multiple budgets with different cadences can be active simultaneously.
3. **Scheduled transactions** are unposted until their date arrives (or are manually confirmed). They can be marked as fixed or estimated. An estimate shows the variance range (e.g. "±$20").
4. **Amount changes** on specific dates are supported — e.g. insurance premium increases on 1 June. Each amount tier has a start date and optional end date.
5. **Recurring within period** — a scheduled transaction can repeat on the same date each period if the budget is recurring.
6. **Overspending is allowed** but flagged — a negative balance is visible.
7. **Expenses and transfers are many-to-many** — both can draw from one or more source envelopes; transfers distribute to one or more recipients, expenses consume from one or more sources.
8. **Transactions are mutable** — edits directly update the transaction; envelopes recalculate balances.
9. **Amount overrides** — adjust a single scheduled transaction's amount without changing the recurring schedule.
10. **Multiple account types** — General (debit), Credit Card, and Loan/Revolving Credit accounts can be linked; envelopes are account-agnostic.
11. **Interest tiers** — Credit Card and Loan accounts support interest rate changes over time. Each tier specifies a rate effective from a start date to an optional end date. When end_date is null, the rate remains active until the next tier begins.
12. **Interest calculation** — three methods supported:

**Per payment** — interest calculated on each payment**Per period** — interest calculated once per budget period**On unpaid balance** — interest calculated on the outstanding balance as of a specific date (e.g. statement date)

---

## Data Model (Logical)

```javascript
Household
  ├── Account []
  │     ├── type: "General" | "CreditCard" | "LoanRevolvingCredit"
  │     ├── balance (running)
  │     ├── Transaction [] (posted)
  │     ├── InterestTier [] (for CreditCard & Loan types only)
  │     │     ├── interest_rate
  │     │     ├── start_date
  │     │     └── end_date (optional; null = ongoing)
  │     └── ScheduledPayment [] (for CreditCard & Loan types)
  │           ├── date_within_period
  │           ├── amount (principal + interest estimate)
  │           └── recurring (bool)
  ├── Envelope []
  │     ├── Transaction [] (posted: Expense | Income | Transfer)
  │     └── ScheduledTransaction []
  │           └── AmountTier [] (amount changes on specific dates)
  └── Budget [] (scheduled transaction collections, multiple active concurrently)
        ├── period: weekly | fortnightly | monthly | custom
        ├── start_date
        └── ScheduledTransaction []
              ├── envelope[] (for Income: multiple recipients; for Expense: multiple sources; for Transfer: src and dst)
              ├── date_within_period
              ├── amount (from AmountTiers)
              ├── recurring (bool: repeats each period)
              └── AmountTier []
```

### Key Entities & Relationships

- A **Household** owns everything — envelopes, budgets, accounts, and scheduled transactions
- A **Budget** has many **ScheduledTransactions**, each on a specific date within the period
- An **Envelope** has Posted Transactions (history) and ScheduledTransactions (future, may appear in multiple)
- A **ScheduledTransaction** references an array of **AmountTiers** for date-based amount changes
- A **Transaction** involves one or more **Envelopes** (Income: 1+ recipients; Expense: 1+ sources; Transfer: 1+ sources → 1+ recipients) and one **Account**
- An **Expense** is a Transaction type that consumes from one or more source envelope(s)
- A **Transfer** is a Transaction type that distributes from source envelope(s) to recipient envelope(s); total is zero-sum
- A **ScheduledTransaction** posts to become a **Transaction** on its scheduled date (or when manually confirmed)

---

## Notifications / Nudges

- 🔔 Envelope < 20% of typical periodic income remaining → "Groceries is running low ($45 left)"
- 🔔 Envelope overspent → "Fun Money is -$12 — transfer funds or acknowledge"
- 🔔 Scheduled transaction approaching (1 day before) → "Electricity bill ($120) due tomorrow"
- 🔔 Estimated transaction variance high → "Groceries estimate ±$20; actual may be $130–$170"
- 🔔 Amount change active → "Insurance premium increased to $150 (was $120)"
- 🔔 Scheduled transaction posted → "Rent: -$1,500 posted to account"
- 🔔 Income split across multiple envelopes → "Salary $2,000 split: $1,500→Bills, $300→Groceries, $200→Fun"
- 🔔 Need confirmation → "Scheduled transactions for July ready — review and confirm"

---

## Out of Scope (v1)

- Multi-currency
- Bank feed sync / open banking
- Investment tracking
- Debt snowball / avalanche planning
- Multi-user support (currently single user per household)

> These are natural v2 candidates once the core envelope loop is solid.
