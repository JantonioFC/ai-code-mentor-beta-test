# Burp Suite Workflow Plan - Round 11

## 1. Environment Setup
*   **Target**: `http://localhost:3000`
*   **Proxy Listener**: `127.0.0.1:8080`
*   **Scope**: Include `localhost:3000`, Exclude `*.google.com`, `*.github.com`.

## 2. Critical Interception Flows

### A. Authentication Manipulation
**Target**: POST `/api/auth/login`
1.  **Capture**: Normal login request.
2.  **Repeater Test 1 (SQLi)**: Change `pEmail` to `admin'--`.
3.  **Repeater Test 2 (NoSQLi)**: Change `pEmail` to `{"$ne": null}` (if JSON).
4.  **Repeater Test 3 (Brute Force)**: Send to Intruder, fuzz `pPassword`.

### B. Usage Recording (Rate Limit Bypass)
**Target**: POST `/api/usage/record`
1.  **Capture**: Valid usage record request.
2.  **Repeater Test 1 (Race Condition)**: Use "Turbo Intruder" (or parallel repeated requests) to send 50 requests simultaneously.
    *   *Goal*: Check if database counter increments > 1 per actual action.
3.  **Repeater Test 2 (Negative Values)**: Set count to `-1`.

### C. Portfolio Export (Logic Abuse)
**Target**: POST `/api/export-portfolio`
1.  **Capture**: Export request for current user.
2.  **Repeater Test 1 (IDOR)**: Change `userId` in body to another existing ID (e.g., `1`).
3.  **Repeater Test 2 (Parameter Tampering)**: Inject shell characters into `studentName` to test PDF generation sanitizer.
    *   Payload: `Juan; sleep 5;`

### D. Session Token Analysis
1.  **Capture**: Response from Login.
2.  **Analysis**:
    *   Check `Set-Cookie` flags: `HttpOnly`, `Secure`, `SameSite=Strict`.
    *   Decode JWT: Check algorithm (`HS256` vs `None`).

## 3. Automated Scanning (Pro Mode - Optional)
*   If available, run "Crawl and Audit" on `/dashboard` to identify hidden client-side logic issues.
