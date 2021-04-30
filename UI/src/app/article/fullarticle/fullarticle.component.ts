import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-fullarticle',
  templateUrl: './fullarticle.component.html',
  styleUrls: ['./fullarticle.component.css'],
})
export class FullarticleComponent implements OnInit {
  isShow: boolean;
  topPosToStartShowing = 100;
  constructor() {}
  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    console.log('[scroll]', scrollPosition);

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }
  // TODO: Cross browsing
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  ngOnInit(): void {}
}
