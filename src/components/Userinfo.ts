import { Iuseraddress, Iuserinfo, Tusercontacts } from "../types";

class UserInfo implements Iuserinfo {
  email: string;
  phonenumber: string;

  constructor(data: Tusercontacts) {
  this.email = data.email;
  this.phonenumber = data.phonenumber;
  }
  payment: string;
  address: string;

  checkValidation(data: Record<keyof Tusercontacts, string>): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Простая проверка email
  const phoneRegex = /^\d{10}$/; // Пример проверки для 10-значного номера

  return emailRegex.test(data.email) && phoneRegex.test(data.phonenumber.toString());
}
}

class UserAddress implements Iuseraddress {
  address: string;

  constructor(address: string) {
    this.address = address;
  }

  checkValidation(address: string): boolean {
    return address.trim().length > 0; // Проверка на пустоту
  }
}