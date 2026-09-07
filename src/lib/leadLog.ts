/**
 * Durable lead logging to a Google Sheet.
 *
 * Leads previously existed only as an email sent through a free relay.
 * If the relay throttled, the mailbox filtered it, or nobody checked the
 * inbox that day, the enquiry vanished with no record it had ever
 * arrived. This writes every lead to a spreadsheet as well, which costs
 * nothing and gives the sales team a list to work from and a number to
 * report.
 *
 * Setup (one-time, free, no CRM required):
 *   1. Create a Google Sheet with a header row:
 *      Timestamp | Type | Name | Phone | Email | Destination |
 *      TravelMonth | Source | PageUrl | Referrer | utm_source |
 *      utm_medium | utm_campaign | Notes
 *   2. Extensions → Apps Script, paste:
 *
 *        function doPost(e) {
 *          var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
 *          var d = JSON.parse(e.postData.contents);
 *          sheet.appendRow([
 *            new Date(), d.type || '', d.name || '', d.phone || '',
 *            d.email || '', d.destination || '', d.travelMonth || '',
 *            d.source || '', d.pageUrl || '', d.referrer || '',
 *            d.utm_source || '', d.utm_medium || '', d.utm_campaign || '',
 *            d.notes || ''
 *          ]);
 *          return ContentService.createTextOutput('ok');
 *        }
 *
 *   3. Deploy → New deployment → Web app → Execute as: Me →
 *      Who has access: Anyone. Copy the /exec URL.
 *   4. Set LEAD_SHEET_URL to that URL in Vercel project settings.
 *
 * Until LEAD_SHEET_URL is set this is a no-op, so nothing breaks while
 * the sheet is being created.
 */

const LEAD_SHEET_URL = process.env.LEAD_SHEET_URL;

/** Fields we persist. Everything is optional except the contact details. */
export interface LeadRecord {
  type: string;
  name?: string;
  phone?: string;
  email?: string;
  destination?: string;
  travelMonth?: string;
  source?: string;
  pageUrl?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  notes?: string;
}

/**
 * Appends one lead to the sheet. Never throws: a logging failure must
 * not turn a captured lead into an error the visitor sees.
 */
export async function logLeadToSheet(record: LeadRecord): Promise<void> {
  if (!LEAD_SHEET_URL) return;

  try {
    // Apps Script web apps are slow to cold-start. Cap the wait so a
    // sluggish sheet never holds up the response to the browser.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    await fetch(LEAD_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      signal: controller.signal,
      // Apps Script answers with a 302 to script.googleusercontent.com.
      redirect: "follow",
      cache: "no-store",
    });

    clearTimeout(timeout);
  } catch {
    // Swallowed deliberately. The lead has already been emailed; the
    // sheet is the backup, not the primary path.
  }
}
