import {Component} from '@angular/core';

import {GlobalState} from '../../../global.state';
import {LoginService } from '../../../pages/login/login.service';
import {AppModule} from '../../../app.module';
@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {
  lgservice;
  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;

  constructor(private _state:GlobalState) {
    this.lgservice = AppModule.injector.get(LoginService);
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }
  public clicked(){
    // alert(event);
    console.log("CLICKED LOGOUT");
    this.lgservice.logOut()
     .subscribe(
        (response) => {
          // const token = localStorage.getItem('access_token');
          // console.log("Token is after logout: " + token);
          console.log("Successfully logged out! Redirecting: " + response);
      },
        (error) => console.log(error)
      );
  }
}
