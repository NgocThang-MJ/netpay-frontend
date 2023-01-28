import { DateValueType } from "react-tailwindcss-datepicker/dist/types";

export enum Attribute {
  MustHave = "MustHave",
  NiceToHave = "NiceToHave",
  Wasted = "Wasted",
}

export interface Record {
  _id: { $oid: string };
  name: string;
  date: string;
  price: string;
  attribute: Attribute;
}

export interface RecordForm {
  _id: { $oid: string };
  name: string;
  date: DateValueType;
  price: string;
  attribute: Attribute;
}
