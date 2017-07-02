import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { AppModule } from '../../app.module';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {
  lgservice;
  form: FormGroup;
  username: AbstractControl;
  password: AbstractControl;
  publicsubmitted: boolean = false;
  location: [number, number];

  constructor(fb: FormBuilder) {
    this.lgservice = AppModule.injector.get(LoginService);
    this.form = fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(2)])]
    });

    this.username = this.form.controls['username'];
    this.password = this.form.controls['password'];
  }
  ngOnInit() {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.location = [position.coords.longitude, position.coords.latitude];
        }
        (error) => {
          console.log(error);
        });
    }

  }

  public onSubmit(values: Object) {
    this.submitted = true;
    if (this.form.valid) {

      this.lgservice.logIn(values["username"], values["password"], this.location)
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

      // console.log(values["username"]);
      // console.log(values.password);


    }
  }
}
