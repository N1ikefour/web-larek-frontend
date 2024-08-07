import { Iitem } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

// export interface ICard {
//   title: string;
//   description?: string | string[];
//   image: string;
// }

export class Card extends Component<Iitem> {
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
      super(container);

      this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
      this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
      this._button = container.querySelector(`.${blockName}__button`);
      this._description = container.querySelector(`.${blockName}__description`);
      this._category = container.querySelector(`.${blockName}__category`)
      this._price = container.querySelector(`.${blockName}__prise`)

      if (actions?.onClick) {
          if (this._button) {
              this._button.addEventListener('click', actions.onClick);
          } else {
              container.addEventListener('click', actions.onClick);
          }
      }
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

  set category(value: string) {
    this.setText(this._category, value);
  }

  get category(): string {
    return this._category.textContent || '';
  }

  set price(value: number) {
    this.setText(this._price, value.toString());
  }

  get price(): number {
    const priceText = this._price.textContent || '0'; // исправлено
    return parseFloat(priceText); // преобразование строки в число
  }
  

}