import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/loader.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private _router:Router,public loader:LoaderService) { }

  ngOnInit(): void {
  }

  dashboard(){
    this._router.navigate(['/dashboard'])
  }
  user(){
    this._router.navigate(['/user'])
  }
  roles(){
    this._router.navigate(['/roles'])
  }
  product(){
    this._router.navigate(['/product'])
  }
  category(){
    this._router.navigate(['/category'])
  }
  section(){
    this._router.navigate(['/section'])
  }

}
