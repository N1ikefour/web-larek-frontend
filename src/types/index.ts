export interface Iitem {
  id: string,
  description?: string,
  image: string,
  title: string,
  category: string,
  price: number | null,
  preview?: string
}


export interface Ibasket {
  totalItems: number,
  itemlist: string[],
}

export type Payment = 'cash' | 'card'

export interface Iorder {
  items: string[]
  email: string,
  phone: string,
  address: string,
  total: number,
  payment: Payment,
}


export type OrderForm = Omit<Iorder, 'total' | 'items'>

export interface IorderResult {
  id: string,
  total: number
}