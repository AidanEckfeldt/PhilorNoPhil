# Finding Your Supabase Connection String

## Option 1: From Database Settings (Current Page)

1. On the Database Settings page you're currently on, look for a section called:
   - **"Connection string"** or
   - **"Connection info"** or
   - **"Connection pooling"**

2. Scroll down on the current page - it might be below the SSL Configuration section

3. Look for tabs that say:
   - **URI** (this is what you need!)
   - JDBC
   - Node.js
   - etc.

## Option 2: From Project Settings

1. In the left sidebar, look for **"Project Settings"** (gear icon at the bottom)
2. Click on **"Project Settings"**
3. Look for **"Database"** in the settings menu
4. Find the **"Connection string"** section
5. Select the **"URI"** tab
6. Copy the connection string - it will look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

## Option 3: From Connection Pooling

1. In the left sidebar under "DATABASE MANAGEMENT", look for **"Connection Pooling"** or go back to the main Database page
2. There should be connection strings there with different modes:
   - **Session mode** (for migrations)
   - **Transaction mode** (for queries)
   - **Direct connection** (for Prisma)

## What to Look For

The connection string you need will look like one of these:

```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

OR (if using connection pooling):

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Important Notes:**
- Replace `[PASSWORD]` with your actual database password (the one shown on the Database Settings page)
- For Prisma, you typically want the **direct connection** (port 5432) or **transaction mode** (port 6543)
- The **Session mode** (port 5432) is usually best for Prisma migrations

## Quick Check

If you can't find it, try:
1. Click **"Project Settings"** in the left sidebar (bottom of the list)
2. Then click **"Database"** 
3. Look for **"Connection string"** section

Let me know what you see and I'll help you get the right connection string!

