import { Iitem } from "../types";
import { bem, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface IcardActions {
  onClick: (event: MouseEvent) => void;
}

type CardMod = 'compact' | 'full';

export class Card extends Component<Iitem> {
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _category?: HTMLElement;
  protected _price: HTMLElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: IcardActions) {
      super(container);

      this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
      this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
      this._button = container.querySelector(`.${blockName}__button`);
      this._description = container.querySelector(`.${blockName}__description`);
      this._category = container.querySelector(`.${blockName}__category`)
      this._image =container.querySelector(`.${blockName}__image`)

      if (actions?.onClick) {
          if (this._button) {
              this._button.addEventListener('click', actions.onClick);
          } else {
              container.addEventListener('click', actions.onClick);
          }
      }
  }

  toggle(modif: CardMod) {
    this.toggleClass(bem('card', undefined, modif).name)
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

  set description(value: string) {
     this.setText(this._description, value);
  }

  set button(value: string) {
    this.setText(this._button, value)
  }

  set price(value: number) {
    this.setText(this._price, value? `${value} синапсов` : 'бесценно'); 
    if (this._button) {
      console.log(this._button)
      this._button.disabled = !value;
    }
  }
  

}