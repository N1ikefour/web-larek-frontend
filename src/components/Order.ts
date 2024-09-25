import { OrderForm, Payment } from "../types";
import { ensureElement } from "../utils/utils";
import { EventEmitter } from "./base/events";
import { Form } from "./Form";

export class Order extends Form<OrderForm> {
    protected _payCard: HTMLButtonElement;
    protected _payCash: HTMLButtonElement;


    constructor(events: EventEmitter, container: HTMLFormElement) {
        super(events, container);

        this._payCard = ensureElement<HTMLButtonElement>('.button_alt[name=card]', this.container);
        this._payCash = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', this.container);

        this._payCard.addEventListener('click', () =>{
            this.payment = 'card';
            this.onInputChange('payment', 'cash');
        })

        this._payCash.addEventListener('click', () => {
            this.payment = 'cash';
            this.onInputChange('payment', 'cash')
        })
    }

    set payment(value: Payment) {
        this._payCard.classList.toggle('button_alt-active', value === 'card');
        this._payCash.classList.toggle('button_alt-active', value === 'cash')
    }

    set address (value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}