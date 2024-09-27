import { View } from "./base/Component";
import { EventEmitter } from "./base/events";
import { ensureElement } from "../utils/utils";


interface IformState {
    valid: boolean;
    errors: string[]
}

export class Form<T> extends View<IformState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(events: EventEmitter, protected container: HTMLFormElement) {
        super(events, container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        })

        this.container.addEventListener('submit', (e:Event) => {
            e.preventDefault();
            console.log(this._submit)
            this.events.emit(`${this.container.name}:submit`);
        })
    }


    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field, value
        })
        
            const isValid = this.validateForm();
            this.valid = isValid;
        }

        // Пример метода валидации
        protected validateForm(): boolean {
        const inputs = this.container.querySelectorAll('input, textarea');
        return Array.from(inputs).every((input) => {
            const value = (input as HTMLInputElement | HTMLTextAreaElement).value;
            return value.trim() !== '';
        });
    }

    set valid (value: boolean) {
        this._submit.disabled = !value;
    }

    set errors (value: string) {
        this.setText(this._errors, value)
    }

    render(state: Partial<T> & IformState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors})
        Object.assign(this, inputs);
        return this.container
    }
    
}