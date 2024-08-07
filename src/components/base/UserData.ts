import { IOrder, Ibasket, Iitem, Iuserinfo } from "../../types";
import { IEvents } from "./events";
import { Model } from "./model";


export type CatalogChangeEvent = {
  catalog: LotItem[]
};

export class LotItem extends Model<Iitem> {
  description: string;
  id: string;
  image: string;
  title: string;
  price: string;
  category: string;


}

export class UserData extends Model<Iuserinfo> {
  email: string;
  phonenumber: string;
  catalog: LotItem[];
  order: IOrder = {
    email: '',
    phonenumber: '',
    address: '',
    payment: '',
    items: []
  };
  
  constructor(data: Partial<Iuserinfo>, events: IEvents) {
    super(data, events);
    this.email = data.email;
    this.phonenumber = data.phonenumber;
  }

  setCatalog(items: Iitem[]) {
    this.catalog = items.map(item => new LotItem(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
    }

}