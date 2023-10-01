import { Component, OnInit } from '@angular/core';
import { LocationSevice } from 'src/app/services/location.service';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
  title = 'Welcome to chat Project';
  constructor(private locationService: LocationSevice) { }

  ngOnInit(): void {
  }


  goto() {
    this.locationService.enableNavigation('./main/newchat');
  }
}
