import { Iitem } from "../../types";
import { IEvents } from "./events";
import { Model } from "./model";

class CatalogData extends Model<Iitem> {
  catalog:Iitem[]

  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
  preview?: string;

  constructor(data: Partial<Iitem>, events: IEvents) {
    super(data, events); 

    this.catalog = []; 
    this.id = data.id ;
    this.description = data.description; 
    this.image = data.image;
    this.title = data.title;
    this.category = data.category; 
    this.price = data.price;
    this.preview = data.preview; 
  }


}