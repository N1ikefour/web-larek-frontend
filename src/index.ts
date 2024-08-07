import { AuctionAPI } from './components/AuctionAPI';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { CatalogChangeEvent, UserData } from './components/base/UserData';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);
// const appData = new UserData({}, events);
const page = new Page(document.body, events);


const appData = new UserData({}, events);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');




api.getLotList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });

    
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
    });
    return card.render({
      title: item.title,
      image: item.image,
      description: item.description,
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      category: item.category
    });
  });
});