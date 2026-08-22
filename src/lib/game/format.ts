const UNITS = [
  { value: 1e33, name: "décillion" },
  { value: 1e30, name: "nonillion" },
  { value: 1e27, name: "octillion" },
  { value: 1e24, name: "septillion" },
  { value: 1e21, name: "sextillion" },
  { value: 1e18, name: "quintillion" },
  { value: 1e15, name: "quadrillion" },
  { value: 1e12, name: "trillion" },
  { value: 1e9, name: "milliard" },
  { value: 1e6, name: "million" },
];

export function formatNumber(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "∞";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs < 1_000) {
    if (abs < 10 && !Number.isInteger(abs) && abs !== 0) {
      return `${sign}${abs.toLocaleString("fr-FR", { maximumFractionDigits: digits, minimumFractionDigits: 1 })}`;
    }
    return `${sign}${Math.floor(abs).toLocaleString("fr-FR")}`;
  }

  for (const unit of UNITS) {
    if (abs >= unit.value) {
      const scaled = abs / unit.value;
      const formatted = scaled.toLocaleString("fr-FR", {
        maximumFractionDigits: scaled >= 100 ? 0 : scaled >= 10 ? 1 : digits,
      });
      const plural = scaled >= 2 ? "s" : "";
      return `${sign}${formatted} ${unit.name}${plural}`;
    }
  }

  return `${sign}${Math.floor(abs).toLocaleString("fr-FR")}`;
}

export function formatCps(value: number): string {
  if (value < 0.1 && value > 0) return `${value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} / s`;
  return `${formatNumber(value)} / s`;
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours} h ${minutes.toString().padStart(2, "0")} min`;
  if (minutes > 0) return `${minutes} min ${seconds.toString().padStart(2, "0")} s`;
  return `${seconds} s`;
}

export function lemonWord(count: number): string {
  return Math.abs(count) >= 2 ? "citrons" : "citron";
}
