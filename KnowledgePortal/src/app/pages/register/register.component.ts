import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "app/_services/user.service";

declare var swal: any;
declare var $: any

@Component({
    selector: 'app-register-cmp',
    templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {
    test: Date = new Date();
    registerForm = this.fb.group({
        name: ["", Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\.\'\-]{2,50}(?= [a-zA-Z\.\'\-]{2,50})/)])],
        email: ["", Validators.compose([Validators.required, Validators.email])],
        username: ["", Validators.compose([Validators.required, Validators.pattern(/^\S*$/)])],
        password: ["", Validators.compose([Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/)])]
    });

    constructor(private fb: FormBuilder, private router: Router, private userService: UserService){ }
    
    ngOnInit() {
        setTimeout(function() {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700);
    }

    termsChange(event) {
        if(event.target.checked) {
           $('#bt-register').prop('disabled', false);
        }else{
            $('#bt-register').prop('disabled', true);
        }
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
