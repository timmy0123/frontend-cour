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
  storeName: string[];
  city: string[];
  district: string[];
  address: string[];
}
export interface rowtype {
  storeName: string;
  city: string;
  district: string;
  address: string;
}
export interface AbsList {
  id: string;
  pictureUrl: string;
  title: string;
  subtitle: string;
  Description: string;
}
