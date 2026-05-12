# Kejani Homes — Backend Handover Instructions
**Date:** May 6, 2026
**Priority:** High (Final Production Readiness)

## 🔴 CRITICAL: Super Admin Access Failure
The platform owner is unable to log into the Super Admin dashboard at `/admin/login`. 
- **Error:** "Invalid login credentials"
- **Task:** 
    1. Ensure `bridgesmwashighadi2@gmail.com` exists in the **Supabase Auth** table.
    2. Reset the password to `40233095` (or provide the owner with the correct one).
    3. Ensure the `role` in the `public.profiles` table is set to `admin` for this user ID.
    4. Verify that "Email Confirmation" is either turned off or the user is marked as "Confirmed".

---

## 1. M-Pesa Integration (STK Push)
The system is currently set to a "Free Contact" model, but the front-end code is prepared to call a Supabase Edge Function for payments.
- **Task:** Create a Supabase Edge Function named `mpesa-stk-push`.
- **Logic:** It should receive `phone` and `amount`, authenticate with Safaricom Daraja API, and initiate an STK push.
- **Reference:** `src/services/paymentService.ts` expects this endpoint to exist.

## 2. Fix Database Schema Cache (`max_guests`)
There is a persistent "Schema Cache Error" when trying to save the `max_guests` field in the `listings` table.
- **Task:** 
    1. Verify the `max_guests` column exists in the `listings` table (Integer type).
    2. Run `NOTIFY pgrst, 'reload config';` in the SQL Editor to refresh PostgREST.
    3. Once fixed, uncomment the `max_guests` line in `src/services/hostService.ts` (line 166).

## 3. Implement Role-Based Access Control (RBAC)
The frontend is now checking for `role = 'admin'` in the `profiles` table.
- **Task:** 
    1. Update RLS policies on `profiles` so that only `admin` users can run `UPDATE` on other people's roles.
    2. Ensure `admin` users have `SELECT` access to all rows in `profiles`, `listings`, and `unlocks`.

## 4. Platform Analytics (Statistics)
The "Platform Stats" tab requires aggregated data across the whole site.
- **Task:** 
    1. Create a View or an RPC named `get_platform_summary` that returns counts of listings by category, total views, and user sign-up trends.
    2. Ensure this function is marked as `SECURITY DEFINER` so only the Super Admin can call it.

## 6. Super Admin User Management (Hire/Fire)
The Super Admin dashboard now includes buttons to "Add New Agent" and "Delete User." Since these actions modify the `auth.users` table, they require **Supabase Edge Functions**.

- **Function 1: `create-agent`**
    - **Logic:** Receives `email` and `fullName`. Uses `supabase.auth.admin.createUser` with `service_role` key.
    - **Security:** Must verify the caller's JWT has `role = 'admin'`.
    - **Action:** Set `email_confirm: true` and insert the `fullName` into `public.profiles`.

- **Function 2: `delete-user`**
    - **Logic:** Receives `userId`. Uses `supabase.auth.admin.deleteUser`.
    - **Security:** Must verify the caller is an `admin`.
    - **Action:** This should also clean up any related listings in `public.listings`.

## 7. Booking Conflict Logic

## 5. Security Hardening
- **Task:** Ensure that `SERVICE_ROLE` keys are NEVER used in the front-end. 
- **Action:** I have already removed hardcoded secrets from the codebase, but please verify that all production environment variables are set in your Supabase dashboard and Vercel/Hosting provider.

---

## Technical Debt to Clean Up
- **Unused Tables:** Check if `payments` and `unlocks` tables can be merged into a single `transactions` table for better tracking.
- **Storage:** Check the `listing-photos` bucket permissions to ensure agents can only delete their own photos.

**Status:** The system is "Frontend Ready." Completing these tasks will make it "Enterprise Ready."
