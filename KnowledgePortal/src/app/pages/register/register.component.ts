import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "app/_services/user.service";

declare var swal : any;

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
    constructor(public fb: FormBuilder, public router: Router, public userService: UserService){}
    test: Date = new Date();
    ngOnInit() {
    }
    doRegister(event){
        event.preventDefault();
        let formObj = this.registerForm.getRawValue(); // {name: '', description: ''}
        
        this.userService.create(formObj)
            .subscribe(
                data => {
                    swal({
                        type: 'success',
                        html: 'Greate! <strong>' +
                                'User creation successfull' +
                              '</strong>. <br /> You can now log-in!',
                        confirmButtonClass: 'btn btn-success',
                        buttonsStyling: false
                    });
                    this.router.navigate(['pages/login']);
                },
                error=>{
                    swal({
                        type: 'error',
                        html: 'Oooopppss! <strong>' +
                                error.error.userMessage +
                              '</strong>. <br /> You can correct it and try again!',
                        confirmButtonClass: 'btn btn-danger',
                        buttonsStyling: false
                    });
                }
            );
    }
}
