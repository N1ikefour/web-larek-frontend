import { Api, ApiListResponse } from "./base/api";
import { Iorder, IorderResult, Iitem, OrderForm } from "../types";

export interface IlarekAPI {
    getItemsList: () => Promise<Iitem[]>;
    getItem: (id:string) => Promise<Iitem>; 
    orderItems: (order: Iorder) => Promise<IorderResult>;
}

export class AppAPI extends Api implements IlarekAPI {
    readonly cdn: string

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }


    getItemsList():  Promise<Iitem[]> {
        return this.get('/product').then((data: ApiListResponse<Iitem>) =>
        data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
        }))
        );
    }


    getItem(id: string): Promise<Iitem>{
        return this.get(`/product/${id}`).then(
            (data: Iitem) => ({
                ...data,
                image: this.cdn + data.image
            })
        )
    };


    orderItems(order: Iorder): Promise<IorderResult> {
        return this.post('/order', order).then(
            (data: IorderResult) => data
        )
    };
}
