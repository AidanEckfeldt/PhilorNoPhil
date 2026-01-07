# Phil or No Phil

A simple, friend-group prediction market app built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- Simple username-based authentication (no passwords)
- Create yes/no prediction markets
- Buy YES or NO shares with dynamic pricing
- Manual market resolution with automatic payouts
- Leaderboard showing user balances

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your database:
   - Create a PostgreSQL database
   - Copy `.env.example` to `.env` and update `DATABASE_URL` with your database connection string

3. Run Prisma migrations:
```bash
npx prisma generate
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Making a User Admin

The resolve button is only visible to:
- The **market creator** (who created that specific market)
- Any user with **admin privileges**

To make a user an admin, you have a few options:

### Option 1: Using the script (easiest)
```bash
npx tsx scripts/make-admin.ts <username>
```
Example: `npx tsx scripts/make-admin.ts Master`

### Option 2: Using Prisma Studio (visual)
```bash
npx prisma studio
```
Then navigate to the User table, find the user, and toggle `isAdmin` to `true`.

### Option 3: Direct database access
Set `isAdmin = true` for the desired user in your PostgreSQL database.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM**
- **PostgreSQL**

