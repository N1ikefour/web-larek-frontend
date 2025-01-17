# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Данные и типы данных, используемые в приложении 

Карточка 

```
export interface Iitem {
  id: string,
  description: string,
  image: string,
  title: string,
  category: string,
  price: number,
  preview: string | null,
}
```
Корзина

```
export interface Ibasket {
  total: number,
  itemlist: Iitem[],
}
```
Интерфейс для форм оформления заказа

```

export interface Iuserinfo {
  address: string,
  email: string,
  phonenumber: number,
}
```

``` 
Данные используемые для модельного окна с адресом

```
export interface Iuseraddress {
  address: string,
  checkValidation(address: string): boolean
}
``` 
```
Данные карточки используемые для модельного окна карточки

```
export type Titeminfo = Pick<Iitem, 'title' | 'image' | 'category' | 'description' | 'price'>;
```
Данные карточки используемые для отображании в корзине

```

export type Tbasketlist = Pick <Iitem, 'title' | 'price'>[];
```

Данные юзера используемые в модельном окне с полями телефона и email 

```
export type Tusercontacts = Pick <Iuserinfo, 'email' | 'phonenumber'>
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентее, отвечает за связь представления и данных.

####  Класс Арі
Содержит в себе базовую погику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

- `constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально).\
Методы:
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с
объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и
отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выплняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
- handleResponse - метод принимает объект ответа и возвращает промис, который разрешается с данными, полученными от сервера, если ответ успешный (статус 2xx). В противном случае промис отклоняется с ошибкой, содержащей сообщение об ошибке или текст статуса ответа.
 * @param {Response} response - Объект ответа от Fetch API.
 * @returns {Promise<object>} Промис, который разрешается с данными ответа в формате JSON.
 * @throws {Promise<Error>} Промис, который отклоняется с ошибкой, если ответ не успешен.

#### Knacc EventEmitter
Брокер событий позволяет отправлять события и подписываться на события происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.\
- constructor() {this._events = new Map<EventName, Set<Subscriber>>();} -
Конструктор инициализирует внутреннюю структуру данных, которая будет использоваться для хранения подписчиков на события. Внутри создается пустая карта, где ключами являются имена событий (типа EventName), а значениями — множества подписчиков (типа Subscriber).

Основные методы, реализуемые классом описаны интерфейсом `IEvents` :
- `on` - подписка на событие
- `enit` - инициализация события
- `trigger`- возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие


### Слои данных 


#### Класс Item 
Класс отвечает за отображение карточки\
Конструктор класса принимает данные карточки\
В полях класса хранятся следующие данные:
- id: string - уникальный идентификатор
- description: string - описание карточки
- image: string - картинка карточки
- title: string - название карточки
- category: string - категория карточки
- price: number - цена карточки
- preview?: string | null - id выбранной карточки для просмотра в модельном окне 


#### Класс Basket 
Класс отвечает за отображение корзины и хранение выбранных инстанций карточек\
В полях класса хранятся следующие данные:
- totalItems: number - количество карточек в корзине
- itemlist: Iitem[] - список карточек добавленных в корзину  

Также класс предоставляет набор методов для вщаимодействия с этими данными.
- addItem(item: Iitem, itemId: string): void - добавляет одну карточку в корзину
- deleteItem(itemId: string, payload: () => void | null): void - удаляет карточку из корзины. Если передан колбек то выполняет его после удаления, если нет, то вызывает событие изменения массива.
- getItem(itemId: string): Iitem - берет карточку на проверку идентичности в корзине
- getSumm(): number - возвращает сумму всех карточек в корзине
- setSumm(summ: number): void - вставляет сумму всех карточек в корзине



#### Класс userinfo
Класс отвечет за хранение и отправку данных пользователя\
В полях класса хранятся следующие данные:
- email: string - поле ввода в котором электронная почта пользователя делающего заказ
- phonenumber: number - поле ввода в котором номер телефона пользователя делающего заказ

Также класс предоставляет метод для вщаимодействия с этими данными.
- checkValidation(data: Record<keyof Tusercontacts, string>): boolean - проверяет поля ввода с данными на валидность

#### Класс useraddress
Класс отвечает за хранение и отправку адреса пользователя\
В полях класса хранятся следующие данные:
- address: string - поле ввода в котором адрес пользователя делающего заказ 

Также класс предоставляет метод для взаимодействия с этими данными.
- checkValidation(address: string): boolean - проверяет поле ввода с данными на валидность



### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Базовый класс Component
Базовый класс Component для управления DOM-элементами.\
- constructor(selector: string) {this.element = document.querySelector(selector) as HTMLElement;}- Конструктор класса принимает селектор HTML элемента
- protected element: HTMLElement - HTML элемент для управления разметкой\
Методы: 
- setText(text: string): void - Устанавливает текстовое содержимое элемента. text - Текст для установки.
- setActive(isActive: boolean): void - Активирует или деактивирует элемент. isActive - Флаг активности
- addClass(className: string): void - Добавляет класс к элементу. className - Имя класса для добавления
- removeClass(className: string): void - Удаляет класс к элементу. className - Имя класса для добавления

#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.  
- constructor(selector: string, events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса
- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий

#### Класс ModalWithConfirm
Расширяет класс Modal. Предназначен для реализации модального окна подтверждения. При открытии модального окна сохраняет полученный в параметрах обработчик, который передается для выполнения при сабмите формы.\
- constructor(selector: string, events: IEvents, formId: string) - Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно, экземпляр класса `EventEmitter` для возможности инициации событий и id отображаемой формы.\
Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения
- _form: HTMLFormElement - элемент формы
- formId: string - значение атрибута id формы
- handleSubmit: Function - функция, на выполнение которой запрашивается подтверждение

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- open(handleSubmit: Function): void - расширение родительского метода, принимает обработчик, который передается при инициации события подтверждения.
- get form: HTMLElement - геттер для получения элемента формы

#### Класс ModalWithForm
Расширяет класс Modal. Предназначен для реализации модального окна с формой содержащей поля ввода. При сабмите инициирует событие передавая в него объект с данными из полей ввода формы. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет метод для управления активностью кнопки сохранения.\

- constructor(selector: string, events: IEvents, formId: string) - Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно, экземпляр класса `EventEmitter` для возможности инициации событий и id отображаемой формы.\

Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- getInputValues(): Record<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем
- close (): void - расширяет родительский метод дополнительно при закрытии очищая поля формы и деактивируя кнопку сохранения
- get form: HTMLElement - геттер для получения элемента формы

#### Класс ModalWithCard
Расширяет класс Modal. Предназначен для реализации модального окна с изображением расширенных данных карточки. При открытии модального окна получает данные карточки, которые нужно показать.\
- constructor(selector: string, events: IEvents, formId: string) - Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно, экземпляр класса `EventEmitter` для возможности инициации событий и id отображаемой формы.\
Поля класса:
- imageElement: HTMLImageElement - элемент разметки с изображением
- cardName: HTMLElement - элемент разметки для вывода названия карточки
- cardDescription: HTMLElement - элемент разметки для вывода описания карточки
- cardCategory: HTMLSpanElement - элемент разметки для вывода категории карточки
- cardPrice: HTMLSpanElement - элемент разметки для вывода цены карточки
- cardBuyButton: HTMLButtonElement - кнопка добавления карточки в корзину

Методы:
- open(data: Iitem): void - расширение родительского метода, принимает данные карточки, которые используются для заполнения атрибутов элементов модального окна.
- addToBasket(data {title: string, price: number, id:string}): void - метод принимает данные карточки, которые нужны для отображения в массиве карточек в корзине и id для итендификации карточки в корзине и добавляет карточку в корзину


#### Класс ModalBasket
Расширяет класс Modal. Предназначен для реализации модального окна с отображением корзины. При открытии модального окна получает массив с данными карточек, которые нужно показать.\
Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения
- basketItem: HTMLliElement - элемент разметки для вывода данных одной карточки
- basketList: HTMLDivElement - элемент разметки для вывода данных списка картоек 
- cardsIdArray: string[] - массив id карточек в корзине
- basketPrice: HTMLElement - элемент разметки для вывода общей суммы корзины

Методы:
- open(data: {Tbasketlist}): void - расширение родительского метода, принимающий массив карточек, которые используются для заполнения атрибутов элементов модального окна.
- removeItemBasket(cardId:string) - Удаляет карточку из корзины по её id
- get summ(): number - возвращает сумму стоимостей всех карточек
- set summ(data: number) - вставляет новую сумму в элемент разметки корзины
- get count(): number - возвращает количество карточек в корзине
- set count(data: number) -  вставляет новое количество карточек элемент разметки 



#### Класс Card
Отвечает за отображение карточки, задавая в карточке данные названия, описания, категорию, изображения, цену. Класс используется для отображения карточек на странице сайта. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Методы:
- setData(cardData: IItem): void - заполняет атрибуты элементов карточки данными.
- render(): HTMLElement - метод возвращает полностью заполненную карточку с установленными слушателями
- get id(): string возвращает уникальный id карточки

#### Класс CardsGallery
Отвечает за отображение блока с карточками на главной странице. Предоставляет метод `addCard(cardElement: HTMLElement)` для добавления карточек на страницу и сеттер `gallery` для полного обновления содержимого. В конструктор принимает контейнер, в котором размещаются карточки.
Поля:
- cardCotalog: HTMLTemplateElement - темплейт одной карточки, отображаемой на главной странце


### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `basket:changed` - изменение данных корзины
- `cards:changed` - изменение массива карточек
- `card:selected` - изменение открываемой в модальном окне данных карточки


*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `basket:open` - открытие модального окна с содержанием корзины
- `CardInfo:open` - открытие модального окна c описанием карточки
- `address:open` - открытие модального окна с выбором оплаты и адресом пользователя
- `userInfo:open` - открытие модального окна с данными пользователя
- `basket:select` - выбор карточки для добавления в корзину и отображения в модальном окне корзины
- `basket:delete` - выбор карточки для удаления из корзины
- `basket:total` - изменение состояния счетчика количесвта карточек в корзине
- `basket:summ` - изменение состояния счетчика общей стоимоссти карточек в корзине
- `address:input` - изменение данных в форме с адресом пользователя
- `userinfo:input` - изменение данных в форме с данными пользователя

- `address:submit` - сохранение адреса пользователя в модальном окне
- `userinfo:submit` - сохранение номера телефона и почты пользователя в модальном окне
- `modalWithConfirm:submit` - событие, генерируемое при нажатии "За новыми покупками!" в форме подтверждения
- `address:validation` - событие, сообщающее о необходимости валидации формы с адресом
- `userinfo:validation` - событие, сообщающее о необходимости валидации формы с данными пользователя
