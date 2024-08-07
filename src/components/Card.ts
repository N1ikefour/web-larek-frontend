import { Iitem } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
// import {}


export class Card extends Component <Iitem> {

  private events: IEvents;
  // private cardData: Iitem;

  // protected cardElement: HTMLElement;
  protected _title: HTMLElement;
  protected _description: HTMLElement;
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _id: string;
  protected _button: HTMLButtonElement;

  constructor(protected container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events
    // Получаем элементы карточки
    this._title = this.container.querySelector('.card-name') as HTMLElement;
    this._description = this.container.querySelector('.card-description') as HTMLElement;
    this._category = this.container.querySelector('.card-category') as HTMLElement;
    this._image = this.container.querySelector('.card-image') as HTMLImageElement;
    this._price = this.container.querySelector('.card-price') as HTMLElement;
    this._button = this.container.querySelector('.buy-button') as HTMLButtonElement;

     
    
  }

set id(value: string) {
  this.container.dataset.id = value;
}

get id(): string {
  return this.container.dataset.id || '';
}

set title(value: string) {
  this.setText(this._title, value);
}

get title(): string {
  return this._title.textContent || '';
}

set image(value: string) {
  this.setImage(this._image, value, this.title)
}

set description(value: string | string[]) {
    if (Array.isArray(value)) {
        this._description.replaceWith(...value.map(str => {
            const descTemplate = this._description.cloneNode() as HTMLElement;
            this.setText(descTemplate, str);
            return descTemplate;
        }));
    } else {
        this.setText(this._description, value);
    }
}
}


export type CatalogItemStatus = {
status: LotStatus,
label: string
};

export class CatalogItem extends Card<CatalogItemStatus> {
protected _status: HTMLElement;

constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
    this._status = ensureElement<HTMLElement>(`.card__status`, container);
}

set status({ status, label }: CatalogItemStatus) {
    this.setText(this._status, label);
    this._status.className = clsx('card__status', {
        [bem(this.blockName, 'status', 'active').name]: status === 'active',
        [bem(this.blockName, 'status', 'closed').name]: status === 'closed'
    });
}
}

export type AuctionStatus = {
status: string,
time: string,
label: string,
nextBid: number,
history: number[]
};

export class AuctionItem extends Card<HTMLElement> {
protected _status: HTMLElement;

constructor(container: HTMLElement, actions?: ICardActions) {
    super('lot', container, actions);
    this._status = ensureElement<HTMLElement>(`.lot__status`, container);
}

set status(content: HTMLElement) {
    this._status.replaceWith(content);
}
}

interface IAuctionActions {
onSubmit: (price: number) => void;
}

export class Auction extends Component<AuctionStatus> {
protected _time: HTMLElement;
protected _label: HTMLElement;
protected _button: HTMLButtonElement;
protected _input: HTMLInputElement;
protected _history: HTMLElement;
protected _bids: HTMLElement
protected _form: HTMLFormElement;

constructor(container: HTMLElement, actions?: IAuctionActions) {
    super(container);

    this._time = ensureElement<HTMLElement>(`.lot__auction-timer`, container);
    this._label = ensureElement<HTMLElement>(`.lot__auction-text`, container);
    this._button = ensureElement<HTMLButtonElement>(`.button`, container);
    this._input = ensureElement<HTMLInputElement>(`.form__input`, container);
    this._bids = ensureElement<HTMLElement>(`.lot__history-bids`, container);
    this._history = ensureElement<HTMLElement>('.lot__history', container);
    this._form = ensureElement<HTMLFormElement>(`.lot__bid`, container);

    this._form.addEventListener('submit', (event) => {
        event.preventDefault();
        actions?.onSubmit?.(parseInt(this._input.value));
        return false;
    });
}

set time(value: string) {
    this.setText(this._time, value);
}
set label(value: string) {
    this.setText(this._label, value);
}
set nextBid(value: number) {
    this._input.value = String(value);
}
set history(value: number[]) {
    this._bids.replaceChildren(...value.map(item => createElement<HTMLUListElement>('li', {
        className: 'lot__history-item',
        textContent: formatNumber(item)
    })));
}

set status(value: LotStatus) {
    if (value !== 'active') {
        this.setHidden(this._history);
        this.setHidden(this._form);
    } else {
        this.setVisible(this._history);
        this.setVisible(this._form);
    }
}

focus() {
    this._input.focus();
}
}