export interface Iitem {
  id?: string,
  description?: string,
  image: string,
  title: string,
  category: string,
  price: number,
  preview?: string,
}


export interface Ibasket {
  totalItems: number,
  itemlist: Iitem[],
  addItem(item: Iitem, itemId: string): void;
  deleteItem(itemId: string, payload: () => void | null): void;
  getItem(itemId: string): Iitem;
  getSumm(): number;
  setSumm(summ: number): void;
}


export interface Iuserinfo {
  email: string,
  phonenumber: string,
  payment: string,
  address: string,
  // checkValidation(data: Record<keyof Tusercontacts, string>): boolean
}

export interface Iuseraddress {
  address: string,
  checkValidation(address: string): boolean
}


export interface IOrder extends Iuserinfo {
  items: string[]
}




export type Titeminfo = Pick<Iitem, 'title' | 'image' | 'category' | 'description' | 'price'>;

export type Tbasketlist = Pick <Iitem, 'title' | 'price' | 'id'>[];

export type Tusercontacts = Pick <Iuserinfo, 'email' | 'phonenumber' | 'payment' | 'address'>