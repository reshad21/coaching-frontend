const generateMonthOptions = (startYear = new Date().getFullYear(), years = 2) => {
  const options = [];
  for (let y = 0; y < years; y++) {
    for (let m = 1; m <= 12; m++) {
      const year = startYear + y;
      const month = m.toString().padStart(2, "0");
      const date = new Date(year, m - 1);
      const monthName = date.toLocaleString("default", { month: "long" });
      options.push({
        value: `${year}-${month}`,
        name: `${monthName} ${year}`,
      });
    }
  }
  return options;
};

export default generateMonthOptions;