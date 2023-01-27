import axios from "axios";
import { Record } from "types/record";

export async function getRecords() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_DEV;
    if (!apiUrl) return Promise.reject("Cannot get API url");
    const res = await axios.get<Record[]>(`${apiUrl}/records`);

    console.log("data", res.data);

    return res.data;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
}
