import { google } from "googleapis";

function getPrivateKey() {
  // Handles env var private keys that are stored with \n
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  return key?.replace(/\\n/g, "\n");
}

export async function GET() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getPrivateKey();

  if (!spreadsheetId || !sheetName || !clientEmail || !privateKey) {
    return Response.json(
      { error: "Missing Google Sheets environment variables." },
      { status: 500 }
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Example: read columns A:C, header row included
  const range = `${sheetName}!A:C`;
  const result = await sheets.spreadsheets.values.get({ spreadsheetId, range });

  const values = result.data.values ?? [];
  if (values.length < 2) {
    return Response.json({ rows: [] });
  }

  // Assume first row is header: Date | Label | Value
  const [header, ...rows] = values;

  // Convert to objects keyed by header values
  const data = rows.map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, i) => (obj[h] = r[i] ?? ""));
    return obj;
  });

  return Response.json({ rows: data });
}