export const MONTH_OPTIONS = [
    { value: "all", label: "Todos os meses" },
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
];

function buildYearOptions() {
    const y = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => {
        const year = y - 2 + i;
        return { value: String(year), label: String(year) };
    });
}

export const YEAR_OPTIONS = buildYearOptions();

export function formatDateDisplay(isoDate) {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    const months = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ];
    return `${day} de ${months[parseInt(month, 10) - 1]} de ${year}`;
}

export function mapApiNote(n) {
    return {
        id: n.id,
        sessionDate: n.sessionDate,
        sessionType: n.sessionType,
        content: n.content ?? n.conteudo ?? "",
        nextSessionDate: n.nextSessionDate || "",
    };
}
