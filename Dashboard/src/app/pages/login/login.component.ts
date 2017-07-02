import {Component, OnInit} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {LoginService } from './login.service';
import {AppModule} from '../../app.module';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit{
  lgservice;
  public form:FormGroup;
  public username:AbstractControl;
  public password:AbstractControl;
  public submitted:boolean = false;

  constructor(fb:FormBuilder) {
    this.lgservice = AppModule.injector.get(LoginService);
    this.form = fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(2)])]
    });

    this.username = this.form.controls['username'];
    this.password = this.form.controls['password'];
  }
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
      navigator.geolocation.getCurrentPosition((position)=>{console.log(`${position.coords.longitude} ${position.coords.latitude}`);}, (error)=>{console.log(error);});
    
  }

  public onSubmit(values: Object) {
    this.submitted = true;
    if (this.form.valid) {

     this.lgservice.logIn(values["username"], values["password"])
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
