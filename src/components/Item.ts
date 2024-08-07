import { Iitem } from "../types";

class Item implements Iitem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
  preview?: string | null;

  constructor(data: Iitem) {
    this.id = data.id;
    this.description = data.description;
    this.image = data.image;
    this.title = data.title;
    this.category = data.category;
    this.price = data.price;
    this.preview = data.preview || null;
  }
}