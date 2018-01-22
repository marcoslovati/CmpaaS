import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  constructor() {}

  // ...
  public isLoggedIn(): boolean {

    const token = localStorage.getItem('token');

    if(!token) return false 
    else return true;
  }

}