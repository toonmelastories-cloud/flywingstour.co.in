/**
 * Shared options for the enquiry forms.
 *
 * Kept in one place so the contact page and the inquiry modal offer the
 * same choices, which also keeps the values in the leads spreadsheet
 * consistent enough to group and count.
 */

import destinations from "@/data/destinations";

/**
 * Travel month choices, rolling twelve months from today.
 *
 * A date picker is the wrong control here: at enquiry stage most people
 * know the month but not the date, and asking for a date they do not
 * have is a reason to abandon the form. "Not decided yet" is first
 * because it is the honest answer for a large share of enquiries and
 * hiding it just produces a wrong month.
 */
export function travelMonthOptions(from: Date = new Date()): string[] {
  const months: string[] = ["Not decided yet"];
  for (let i = 0; i < 12; i++) {
    const d = new Date(from.getFullYear(), from.getMonth() + i, 1);
    months.push(
      d.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    );
  }
  return months;
}

/**
 * Destination suggestions for the enquiry forms.
 *
 * Offered through a datalist rather than a dropdown so the field stays a
 * free-text input: someone asking about Baku or a Europe multi-city trip
 * must still be able to type it. The list is built from the destinations
 * the agency actually sells, so it never suggests something unsupported.
 */
export function destinationSuggestions(): string[] {
  const fromCatalogue = destinations.map((d) => d.name);
  const alsoAsked = [
    "Domestic - not decided",
    "International - not decided",
    "Visa assistance only",
    "Flight tickets only",
    "Corporate / group travel",
  ];
  return [...fromCatalogue, ...alsoAsked];
}
