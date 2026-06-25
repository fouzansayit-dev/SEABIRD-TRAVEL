export const DEALS_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1AeV0KHTZOmT3v91hFFsHRWGdplR_r789AJSKc1Ybljo/export?format=csv";

export const INDIA_AIRPORT_CODES = [
  "DEL", "BOM", "BLR", "HYD", "MAA", "CCU", "COK", "AMD", "ATQ", "TRV"
];

export interface DealRow {
  route_from_code: string;
  route_from_city: string;
  route_via_code?: string;
  route_to_code: string;
  route_to_city: string;
  trip_type: string;
  valid_from: string;
  valid_to: string;
  price_cad: string;
  baggage: string;
  transit_note?: string;
  poster_image_url?: string;
  active: string;
}

export interface Deal extends Omit<DealRow, 'price_cad'> {
  price_cad: number;
}
