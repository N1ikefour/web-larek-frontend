import { IOrder, Iitem } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface IAuctionAPI {
  getLotList: () => Promise<Iitem[]>;
  getLotItem: (id: string) => Promise<Iitem>;
}

export class AuctionAPI extends Api implements IAuctionAPI {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options);
      this.cdn = cdn;
  }

  getLotItem(id: string): Promise<Iitem> {
      return this.get(`/product/${id}`).then(
          (item: Iitem) => ({
              ...item,
              image: this.cdn + item.image,
          })
      );
  }


  getLotList(): Promise<Iitem[]> {
      return this.get('/product').then((data: ApiListResponse<Iitem>) =>
          data.items.map((item) => ({
              ...item,
              image: this.cdn + item.image
          }))
      );
  }



}