import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../login/login.service';
import { AppModule } from '../../app.module';

@Component({
  selector: 'register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register implements OnInit {
  lgservice;
  form: FormGroup;
  name: AbstractControl;
  username: AbstractControl;
  password: AbstractControl;
  submitted: boolean = false;

  constructor(fb: FormBuilder) {
    this.lgservice = AppModule.injector.get(LoginService);
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(2)])]
    });

    this.name = this.form.controls['name'];
    this.username = this.form.controls['username'];
    this.password = this.form.controls['password'];
  }

  ngOnInit() {
    
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      this.lgservice.register(values["name"], values["username"], values["password"])
        .subscribe(
        (response) => {
          localStorage.setItem('access_token', response.access_token);
          console.log("Access Token : \n" + response.access_token);
        },
        (error) => console.log(error)
        );
    }
  }
}
