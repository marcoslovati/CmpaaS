import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Http, Headers } from "@angular/http";
import { SweetAlertComponent } from "app/components/sweetalert/sweetalert.component";
import { Router, RouterStateSnapshot } from "@angular/router";

@Component({
    selector: 'app-register-cmp',
    templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {
    public registerForm = this.fb.group({
        name: ["", Validators.required],
        email: ["", Validators.required],
        username: ["", Validators.required],
        password: ["", Validators.required]
    });
    constructor(public fb: FormBuilder, public http: Http, public router: Router){}
    test: Date = new Date();
    ngOnInit() {
    }
    doRegister(event){
        let formObj = this.registerForm.getRawValue(); // {name: '', description: ''}

        let serializedForm = JSON.stringify(formObj);

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post("http://localhost:3000/v1/users", serializedForm, {headers})
            .subscribe(
                data => {
                    let sw = new SweetAlertComponent();
                    let msg = {
                        type: "success-message",
                        title: "Success",
                        text: 'User creation successfull.'
                    };
                    sw.showSwal(msg);
                    this.router.navigate(['pages/login']);
                },
                error => console.error("couldn't post because", error)
            );
    }
}
