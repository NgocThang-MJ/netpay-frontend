import axios from "axios";
import { Record } from "types/record";

export async function getRecords() {
  try {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL_DEV;
    if (process.env.NODE_ENV === "production") {
      apiUrl = process.env.NEXT_PUBLIC_API_URL_PROD;
    }

    if (!apiUrl) return Promise.reject("Cannot get API url");
    const res = await axios.get<Record[]>(`${apiUrl}/records`);

    return res.data;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
}
