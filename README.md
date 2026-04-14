# Next.js Charts with Google Sheets

## Setup

### 1. Create a Google Service Account
- Go to Google Cloud Console.
- Create a new project (or use an existing one).
- Navigate to "IAM & Admin" > "Service Accounts".
- Create a new service account and download the JSON key file.

### 2. Share Your Google Sheet
- Open your Google Sheet.
- Share it with the email address of your service account (found in the downloaded JSON file).

### 3. Set Environment Variables in Vercel
- Go to your Vercel project settings.
- Add the following environment variables:
  - `GSA_CLIENT_EMAIL` – Your service account email.
  - `GSA_PRIVATE_KEY` – Your service account private key.
  - `SHEET_ID` – Your sheet ID.
  - `SHEET_RANGE` – The range you want to fetch (e.g., `Sheet1!A1:D10`).
  - `REVALIDATE_SECRET` – A secret string for revalidation.

### 4. Running Locally
- Clone the repository.
- Run `yarn install` to install dependencies.
- Create a `.env.local` file with the same variables as above.
- Run `yarn dev` to start the local server.

### 5. Optional: Google Apps Script Webhook
- Create a new Apps Script project and paste the following code:

```javascript
function onChange(e) {
  var url = 'https://your-vercel-domain/api/revalidate';
  var options = {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
    },
    'payload': JSON.stringify({
      secret: 'YOUR_REVALIDATE_SECRET'
    })
  };
  UrlFetchApp.fetch(url, options);
}
```
- Deploy the webhook to listen for changes made in Google Sheets.

## Installation

To install the project dependencies, run:

```bash
yarn install
```

## Start the Development Server

Run the following command to start the development server:

```bash
yarn dev
```

## Directory Structure

```
├── apps-script/
│   └── onChange.gs
├── lib/
│   └── sheets.ts
├── pages/
│   ├── api/
│   │   └── revalidate.ts
│   └── index.tsx
├── .env.example
├── .gitignore
├── package.json
└── yarn.lock
```

## Notes
- Ensure to add `.env.local` to your `.gitignore` to avoid committing secrets.
- The project uses TypeScript for type safety.