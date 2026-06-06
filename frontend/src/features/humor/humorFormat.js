const ROTULOS = [
  { min: 0, max: 1, rotulo: "Muito baixo" },
  { min: 2, max: 3, rotulo: "Baixo" },
  { min: 4, max: 5, rotulo: "Regular" },
  { min: 6, max: 7, rotulo: "Bom" },
  { min: 8, max: 9, rotulo: "Ótimo" },
  { min: 10, max: 10, rotulo: "Incrível" },
];

export function getRotulo(score) {
  return ROTULOS.find((r) => score >= r.min && score <= r.max)?.rotulo ?? "Regular";
}

export function getBadgeColor(score) {
  if (score <= 3) return "#e74c3c";
  if (score <= 6) return "#f39c12";
  return "#428A5A";
}

export function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
