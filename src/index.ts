import './scss/styles.scss';
import { AppAPI } from "./components/AppApi"
import { AppData } from "./components/AppData";
import { EventEmitter } from "./components/base/events";
import { Basket } from "./components/Basket";
import { Card } from "./components/Card";
import { Contacts } from "./components/Contacts";
import { Modal } from "./components/Modal";
import { Order } from "./components/Order";
import { Page } from "./components/Page";
import { Success } from "./components/success";
import { Iitem, Iorder, OrderForm } from "./types";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";

const api = new AppAPI(CDN_URL, API_URL);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const events = new EventEmitter();
const appData = new AppData(events);
const modal = new Modal(ensureElement<HTMLTemplateElement>('#modal-container'), events);
const page = new Page( document.body, events);
const basket = new Basket(events);
const orderForm = new Order(events, cloneTemplate(ensureElement<HTMLTemplateElement>('#order')));
const contactsForm = new Contacts(events, cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')))




events.on('contacts:submit', () => {
    console.log(appData)
    api.orderItems(appData.order)
    .then((result) => {
        const success = new Success (cloneTemplate(ensureElement<HTMLTemplateElement>('#success')), {
            onClick: () => {
                modal.close();
                appData.clearBasket();
            }
        }) 

        modal.render({
            content: success.render(result)
        })
    })
    .catch(error => {
        console.error(error)
    })
})

events.on('order:open', () => {
    modal.render({
        content: orderForm.render({
            payment: 'card',
            address: '',
            valid: false,
            errors: []
        })
    })
});


events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    })
})

events.on('order:ready', (order:Iorder) => {
    contactsForm.valid = true;
})

events.on(/^order\..*:change/, (data: {
    field: keyof OrderForm, value: string}) => {
        appData.setOrderField(data.field, data.value)
    });

events.on(/^contacts\..*:change/, (data: {
    field: keyof OrderForm, value: string}) => {
        appData.setOrderField(data.field, data.value)
     });


events.on('formErrors:change', (errors: Partial<OrderForm>) => {
    const {payment, address, email, phone} = errors;
    
    orderForm.valid = !payment && !address;
    orderForm.errors = Object.values ({payment, address}).filter(i => !!i).join('; ');
    contactsForm.errors = Object.values({email, phone}).filter(i => !!i).join('; ');

    console.log('Order form valid:', orderForm.errors);
})


events.on('basket:open', () => {
    modal.render ({
        content: basket.render()
    });
})


events.on('modal:open', () => {
    page.locked = true;
})


events.on('modal:close', () => {
    page.locked = false;
})


events.on('card:select', (item: Iitem) => {
    appData.setPreview(item)
});

events.on('items:change', (items: Iitem[]) => {
    page.catalog = items.map(item => {
        const card = new Card ('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render(item)
    })
})


events.on('basket:change', () => {
    page.counter = appData.basket.itemlist.length;
    basket.items = appData.basket.itemlist.map(id => {
        const item = appData.items.find(item => item.id === id);
        const card = new Card('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => appData.removeFromBasket(item!)
        })
        return card.render(item)
    });
    basket.total = appData.basket.totalItems;
    console.log(appData.basket.totalItems)
})

events.on('preview:change', (item: Iitem) => {
    if (item) {
        const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
            onClick: () => {
                if (appData.inBasket(item)) {
                    appData.removeFromBasket(item);
                    card.button = 'в корзину';
                } else {
                    appData.addToBasket(item);
                    card.button = 'удалить из корзины'
                }
            }
        })
        card.button = appData.inBasket(item) ? 'удалить из корзины' : 'В корину';

        modal.render ({
            content: card.render(item)
        })
    } else {
        modal.close();
    }
})


api.getItemsList()
    .then(appData.setItems.bind(appData))
    .catch (error => {
        console.error(error);
    });
    
     

