import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
// import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';
import {LoginService } from '../login/login.service';
import {AppModule} from '../../app.module';

@Component({
  selector: 'register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  lgservice;
  public form:FormGroup;
  public name:AbstractControl;
  public username:AbstractControl;
  public password:AbstractControl;
  // public repeatPassword:AbstractControl;
  // public passwords:FormGroup;

  public submitted:boolean = false;

  constructor(fb:FormBuilder) {
    this.lgservice = AppModule.injector.get(LoginService);
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(2)])]
      // 'passwords': fb.group({
      //   'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      //   'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      // }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})
    });

    this.name = this.form.controls['name'];
    this.username = this.form.controls['username'];
    this.password = this.form.controls['password'];
    // this.passwords = <FormGroup> this.form.controls['passwords'];
    // this.password = this.passwords.controls['password'];
    // this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  public onSubmit(values:Object):void {
    this.submitted = true;
    if (this.form.valid) {
      this.lgservice.register(values["name"], values["username"], values["password"])
     .subscribe(
        (response) => {
          // const x = localStorage.getItem('ddaccess_token');
          localStorage.setItem('access_token', response.access_token);
          console.log("Access Token : \n" + response.access_token);
          // this.router.navigate(['./SomewhereElse']);
      },
        (error) => console.log(error)
      );
      // your code goes here
      // console.log(values);
    }
  }
}
