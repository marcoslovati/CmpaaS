import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/index.model';
import { uri } from '../global';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    create(user: User) {
        return this.http.post(uri+'/v1/users', user);
    }

    fbCreate(token: Object){
        return this.http.post(uri+'/v1/users/facebook', token, {observe: 'response'});
    }

    gCreate(token: Object){
        return this.http.post(uri+'/v1/users/google', token, {observe: 'response'});
    }
}