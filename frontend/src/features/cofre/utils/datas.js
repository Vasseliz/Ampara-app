export const formatarData = (date) => {
  const options = { weekday: "long", day: "2-digit", month: "long" };
  return date.toLocaleDateString("pt-BR", options);
};

export const getTodayFormatted = () => formatarData(new Date());
