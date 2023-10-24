import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingpageComponent implements OnInit {
  title = 'Welcome to chat Project';
  constructor() { }

  ngOnInit(): void {
  }

}
