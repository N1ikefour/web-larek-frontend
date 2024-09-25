import { Ibasket, Iorder, Iitem, OrderForm, Payment } from '../types';
import { IEvents } from './base/events';

export class AppData {
	items: Iitem[] = [];
	preview: Iitem = null;
	basket: Ibasket = { itemlist: [], totalItems: 0 };
	order: Iorder = {payment: 'card', email: '', phone: '', address: '', total: 0, items:[]};
  formErrors: Partial<Record<keyof OrderForm, string>> = {};
  constructor(protected events: IEvents) {

  }

  setItems(items: Iitem[]) {
    this.items = items;
    this.events.emit('items:change', this.items);
  }

  setPreview(item: Iitem) {
    this.preview = item;
    this.events.emit('preview:change', this.preview);
  }

  inBasket(item: Iitem) {
    return this.basket.itemlist.includes(item.id)
  }

  addToBasket (item: Iitem) {
    this.basket.itemlist.push(item.id); 
    this.basket.totalItems += item.price;
    this.events.emit ('basket:change', this.basket);
  }
    
  removeFromBasket (item: Iitem) {
    this.basket.itemlist = this.basket.itemlist.filter(id => id !== item.id); 
    this.basket.totalItems -= item.price;
    this.events.emit ('basket:change', this.basket);
  }
    
  clearBasket() {
    this.basket.itemlist = [];
    this.basket.totalItems = 0;
    this.events.emit ('basket:change', this.basket);
  }
  
  setPaymentMethod (method: Payment) {
    this.order.payment = method;
  }

  setOrderField(field: keyof OrderForm, value: string) { 
    if (field === 'payment') {
    this.setPaymentMethod(value as Payment);
    } else {
    this.order[field] = value;
    }

    if (this.order.payment && this.validOrder()) {
      this.order.total = this.basket.totalItems;
      this.order.items = this.basket.itemlist; 
      this.events.emit ('order:ready', this.order);
      console.log(this.basket.itemlist)
    }
  }

  validOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }



}
