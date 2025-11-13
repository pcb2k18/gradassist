# GradAssist Setup Instructions

## Environment Variables

This project requires several API keys and configuration values to run. Follow these steps to set up your environment:

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values in `.env.local`:

### Clerk Authentication
- Get your keys from: https://dashboard.clerk.com/last-active?path=api-keys
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key (starts with `pk_test_` or `pk_live_`)
- `CLERK_SECRET_KEY`: Your Clerk secret key (starts with `sk_test_` or `sk_live_`)

### Supabase Database
- Get your keys from your Supabase project settings
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

### Stripe Payments
- Get your keys from: https://dashboard.stripe.com/apikeys
- `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with `sk_test_` or `sk_live_`)
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret (starts with `whsec_`)

### App Configuration
- `NEXT_PUBLIC_APP_URL`: Your app's URL (use `http://localhost:3000` for development)

## Building the Project

Once you've set up your environment variables:

```bash
npm install
npm run build
```

## Running in Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app.

## Important Notes

- Never commit your `.env.local` file - it contains sensitive API keys
- The `.env.example` file should be committed to show what environment variables are required
- Make sure all environment variables are set before running the build command
