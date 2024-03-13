import * as React from "react";
import { Imageurl, ItemList, AbsList } from "../../interface/interface";

require("dotenv").config();
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
export async function getImg(): Promise<Imageurl[]> {
  try {
    const response = await fetch(`${backendUrl}/Image/listImage`, {
      method: "GET",
    });

    if (!response.ok) {
      // Handle non-successful responses
      throw new Error(`Failed to fetch image URLs: ${response.statusText}`);
    }

    const data = await response.json();
    // Assuming the response data is an array of Imageurl objects
    return data["message"] as Imageurl[];
  } catch (error) {
    // Handle fetch errors or JSON parsing errors
    console.error("Error fetching image URLs:", error);
    // Return an empty array or throw the error, depending on your requirements
    return [];
  }
}

export async function getItem(): Promise<ItemList[]> {
  try {
    const response = await fetch(`${backendUrl}/Item/listitem`, {
      method: "GET",
    });

    if (!response.ok) {
      // Handle non-successful responses
      throw new Error(`Failed to fetch image URLs: ${response.statusText}`);
    }

    const data = await response.json();
    // Assuming the response data is an array of Imageurl objects
    return data["message"] as ItemList[];
  } catch (error) {
    // Handle fetch errors or JSON parsing errors
    console.error("Error fetching image URLs:", error);
    // Return an empty array or throw the error, depending on your requirements
    return [];
  }
}

export async function getAbs(): Promise<AbsList[]> {
  try {
    const response = await fetch(`${backendUrl}/Abs/listAbs`, {
      method: "GET",
    });

    if (!response.ok) {
      // Handle non-successful responses
      throw new Error(`Failed to fetch Abs URLs: ${response.statusText}`);
    }

    const data = await response.json();
    // Assuming the response data is an array of Imageurl objects
    return data["message"] as AbsList[];
  } catch (error) {
    // Handle fetch errors or JSON parsing errors
    console.error("Error fetching image URLs:", error);
    // Return an empty array or throw the error, depending on your requirements
    return [];
  }
}
