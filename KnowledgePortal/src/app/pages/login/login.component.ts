import { Component, OnInit, ElementRef } from '@angular/core';
import { Validators, FormBuilder } from "@angular/forms";
import { Http, Headers } from "@angular/http";
import { Router } from "@angular/router";

declare var $: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

    public loginForm = this.fb.group({
        username: ["", Validators.required],
        password: ["", Validators.required]
    });
    constructor(public fb: FormBuilder, public http: Http, public router: Router, private element: ElementRef){
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;

    ngOnInit() {
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        setTimeout(function() {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700);
    }
    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function() {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
    doLogin(event) {
        event.preventDefault();
        let formObj = this.loginForm.getRawValue(); // {name: '', description: ''}

        let serializedForm = JSON.stringify(formObj);

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post("http://localhost:3000/v1/auth", serializedForm, {headers})
            .subscribe(
                data => {
                    localStorage.setItem('token', data.headers.get('x-access-token'));
                    this.router.navigate(['dashboard']);
                },
                error => console.error("couldn't post because", error)
            );

    }
}
