export const STANDARD_MOVE_HOURLY_PRICE = 79;
export const EXPRESS_MOVE_HOURLY_PRICE = 99;
export const ENTRUEMPELUNG_PRICE_PER_M3 = 60;

export const STANDARD_MOVE_LABEL = "ab 79 €/Std.";
export const STANDARD_MOVE_DETAILS = "inkl. 2 Mitarbeiter + Fahrzeug";
export const EXPRESS_MOVE_LABEL = "ab 99 €/Std.";
export const EXPRESS_MOVE_DETAILS = "inkl. 2 Mitarbeiter + Fahrzeug";
export const EXPRESS_MOVE_PLANNING = "priorisierte Einsatzplanung";
export const ENTRUEMPELUNG_LABEL = "ab 60 €/m³";
export const ENTRUEMPELUNG_SHORT_DETAILS = "nach Volumen, Etage und Zugang";
export const ENTRUEMPELUNG_LONG_DETAILS =
  "Der endgültige Preis richtet sich nach Volumen (m³), Etage, Aufzug, Laufweg, Zugang und Entsorgungsart.";
export const EXPRESS_MOVE_NOTE =
  "Expressumzüge starten bei 99 €/Std. Der Preis enthält 2 Mitarbeiter, Fahrzeug und priorisierte Einsatzplanung.";

export function formatPricePerHour(value: number) {
  return `ab ${value.toLocaleString("de-DE")} €/Std.`;
}

export function formatPricePerCubicMeter(value: number) {
  return `ab ${value.toLocaleString("de-DE")} €/m³`;
}
