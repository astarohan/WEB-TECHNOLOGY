# Assignment 4 — Server-Side Validation Application using Node.js
**Student:** Rohan Reshi | **PRN:** 202401040034 | **Batch:** WT1 | **Date:** 29 October 2026

## Requirements
Node.js 18 or later. No third-party npm dependencies required.

## Run
1. Extract the ZIP and open the folder in VS Code.
2. In the terminal run `npm start`.
3. Visit `http://localhost:3000`.

## Endpoints
- `GET /` registration website
- `GET /health` health check (200)
- `GET /api/info` capabilities and endpoint information (200)
- `POST /api/register` validates JSON; returns 201 for valid input, 422 for invalid fields, 400 for malformed JSON, and 404 for unknown routes.

## PowerShell tests
Valid:
```powershell
$body = @{name="Rohan Reshi";email="rohan.reshi@example.com";prn="202401040034";mobile="9876543210";course="B.Tech"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/register" -Method Post -ContentType "application/json" -Body $body
```
Invalid:
```powershell
$body = @{name="R";email="bad-email";prn="123";mobile="12345";course="Unknown"} | ConvertTo-Json
try { Invoke-WebRequest -Uri "http://localhost:3000/api/register" -Method Post -ContentType "application/json" -Body $body } catch { $_.ErrorDetails.Message }
```

## Node.js capabilities
- `http`: GET and POST routes and HTTP status codes.
- Custom modules: `src/validator.js` and `src/logger.js`.
- `fs`: serves files and appends event records to `requests.log`.
- `EventEmitter`: emits valid/invalid registration events.
- `Transform` stream: trims the incoming request body before parsing JSON.

## Deployment
Push the project to GitHub and create a Node.js web service on Render or Railway. Set the start command to `npm start`. The server reads `process.env.PORT` and binds to `0.0.0.0`. Add your actual GitHub and deployed URLs to Moodle after testing them; no deployment is claimed by this ZIP.

## Limitations and privacy
This academic demo does not store student records in a database or provide authentication. Use synthetic test information. The event log includes names and email addresses for demonstration; delete `requests.log` before sharing if it contains personal data.

The report's response screenshots are illustrative examples, not captured screenshots of a hosted server. Replace them with screenshots from your own running instance if your instructor requires genuine runtime evidence.
