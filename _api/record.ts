import axios from "axios";
import { DateRangeType } from "react-tailwindcss-datepicker/dist/types";
import { Record } from "types/record";
import { getDefaultDates, formatYMD } from "utils/date";

export async function getRecords(dates: DateRangeType) {
  try {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL_DEV;
    const { startDate: defaultStartDate, endDate: defaultEndDate } =
      getDefaultDates();

    const start = formatYMD(dates.startDate!.toString());
    const end = formatYMD(dates.endDate!.toString());

    const startDate = start || defaultStartDate;
    const endDate = end || defaultEndDate;

    if (process.env.NODE_ENV === "production") {
      apiUrl = process.env.NEXT_PUBLIC_API_URL_PROD;
    }

    if (!apiUrl) return Promise.reject("Cannot get API url");
    const res = await axios.get<Record[]>(
      `${apiUrl}/records?start_date=${startDate}&end_date=${endDate}`
    );

    return res.data;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
}
