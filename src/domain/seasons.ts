export type Season = "spring" | "summer" | "autumn" | "winter";
export type Hemisphere = "north" | "south";
export type SeasonPreference = "auto" | Hemisphere | "off";

const SOUTHERN_ZONES = [
  /^Australia\//, /^Antarctica\//, /^Pacific\/(Auckland|Chatham|Fiji|Tongatapu|Apia|Noumea|Efate)$/,
  /^America\/(Sao_Paulo|Bahia|Recife|Fortaleza|Belem|Maceio|Araguaina|Santarem|Noronha|Cuiaba|Campo_Grande|Porto_Velho|Manaus|Rio_Branco|Eirunepe|Boa_Vista)$/,
  /^America\/(Argentina\/.*|Buenos_Aires|Cordoba|Mendoza|Santiago|Punta_Arenas|Montevideo|Asuncion|La_Paz|Lima)$/,
  /^Africa\/(Johannesburg|Maputo|Harare|Lusaka|Windhoek|Gaborone|Maseru|Mbabane|Luanda|Lubumbashi|Blantyre|Dar_es_Salaam)$/,
  /^Indian\/(Mauritius|Reunion|Antananarivo|Mayotte|Comoro)$/,
];

export function hemisphereFor(timeZone: string): Hemisphere {
  return SOUTHERN_ZONES.some((zone) => zone.test(timeZone)) ? "south" : "north";
}

const NORTHERN: Season[] = ["winter", "winter", "spring", "spring", "spring", "summer", "summer", "summer", "autumn", "autumn", "autumn", "winter"];
const OPPOSITE: Record<Season, Season> = { spring: "autumn", summer: "winter", autumn: "spring", winter: "summer" };

// Meteorological seasons: whole months, flipped south of the equator.
export function seasonFor(date: Date, hemisphere: Hemisphere): Season {
  const northern = NORTHERN[date.getMonth()];
  return hemisphere === "north" ? northern : OPPOSITE[northern];
}

export function activeSeason(preference: SeasonPreference, date: Date, timeZone: string): Season | null {
  if (preference === "off") return null;
  return seasonFor(date, preference === "auto" ? hemisphereFor(timeZone) : preference);
}

export function localTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
}
