import { Ibasket, Iitem } from "../types";

class Basket implements Ibasket {
  totalItems: number = 0;
  itemlist: Iitem[] = [];

  addItem(item: Iitem, itemId: string): void {
    this.itemlist.push(item);
    this.totalItems++;
  }

  deleteItem(itemId: string, payload?: () => void): void {
   const index = this.itemlist.findIndex(item => item.id === itemId);
   if (index !== -1) {
     this.itemlist.splice(index, 1);
     this.totalItems--;
     if (payload) {
        payload();
     }
   }
  }

  getItem(itemId: string): Iitem | undefined {
    return this.itemlist.find(item => item.id === itemId);
  }

  getSumm(): number {
    return this.itemlist.reduce((sum, item) => sum + item.price, 0);
  }

  setSumm(summ: number): void {
   console.log(`Сумма корзины установлена на: ${summ}`);
  }
}