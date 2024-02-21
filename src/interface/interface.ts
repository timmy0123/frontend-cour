export interface Imageurl {
  url: string;
  used: boolean;
}
export interface ItemList {
  id: string;
  locid: string[];
  pictureUrl: string;
  itemName: string;
  title: string;
  subtitle: string;
  itemDescription: string;
  city: string[];
  district: string[];
  address: string[];
}
export interface rowtype {
  city: string;
  district: string;
  address: string;
}
