import {AfterViewInit, Component, OnInit} from '@angular/core';
declare const gapi: any;


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.less']
})
export class SignInComponent implements OnInit, AfterViewInit {
  public auth2: any;

  constructor() { }

  ngOnInit() {
  }

  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '159159970464-dl14uv32usm03ltdhmrd5hl7tdjondmi.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {

        const profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        // YOUR CODE HERE


      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

  ngAfterViewInit() {
    this.googleInit();
  }

}
