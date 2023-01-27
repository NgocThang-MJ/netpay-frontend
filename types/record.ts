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
