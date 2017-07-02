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
  submitted: boolean = false;
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
        },
        (error) => {
          console.log(error);
          console.log("Couldn't get location");
        });
    }
    else {
      // random munich location
      this.location = [11.530838012695312, 48.15875730456923];
    }
    console.log(`Location: ${this.location}`);
  }

  public onSubmit(values: Object) {
    this.submitted = true;
    if (this.form.valid) {

      this.lgservice.logIn(values["username"], values["password"], this.location)
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
