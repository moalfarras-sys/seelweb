export type PublicPrices = {
  umzugStandard: number;
  umzugExpress: number;
  umzugExpressSurchargePct: number;
  reinigungWohnung: number;
  reinigungBuero: number;
  gewerbeUmzug: number;
  entruempelung: number;
  endreinigung: number;
  minimumHoursLabel: string;
};

export function formatPricePerHour(value: number) {
  return `ab ${value.toLocaleString("de-DE")} €/Std.`;
}
