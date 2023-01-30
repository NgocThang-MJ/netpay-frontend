import { DateRangeType } from "react-tailwindcss-datepicker/dist/types";

export function formatYMD(date: string) {
  return new Date(date).toISOString().slice(0, 10);
}

export function getDefaultDates(): DateRangeType {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const defaultStartDate = new Date(currentYear, currentMonth, 2)
    .toISOString()
    .slice(0, 10);
  const defaultEndDate = new Date().toISOString().slice(0, 10);

  return {
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  };
}
