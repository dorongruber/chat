import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Event as NavigationEvent  } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isChatOpen = false;
  @Input() title: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.isChatOpen = this.checkRoute(this.router.url);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEvent) => {
      const navEventCast = event as NavigationEnd;
      console.log('navigation avent -> ', event)
      const url = navEventCast.url;
      this.isChatOpen = this.checkRoute(navEventCast.url);
    });
    console.log('check res => ', this.isChatOpen);
  }

  checkRoute(url: string): boolean {
    const checkIfNum = parseInt(url.slice(-1), 10);
    console.log('last route -> ', url.slice(-1), checkIfNum);

    if (typeof checkIfNum === 'number' && !isNaN(checkIfNum)) {
      return true;
    }
    return false;
  }

  OnBackClick() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
