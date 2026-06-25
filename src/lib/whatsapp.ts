export const WHATSAPP_PHONE = "15877882222";
export const PHONE_DISPLAY = "+1 587-788-2222";
export const EMAIL = "contact@seabirdtravel.ca";
export const ADDRESS = "1004 Parsons Rd SW Unit 8, Edmonton, Canada";

export function whatsappLink(message: string) {
  const text = encodeURIComponent(message);
  return `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${text}&type=phone_number&app_absent=0`;
}
