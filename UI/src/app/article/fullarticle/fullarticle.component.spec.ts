import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullarticleComponent } from './fullarticle.component';

describe('FullarticleComponent', () => {
  let component: FullarticleComponent;
  let fixture: ComponentFixture<FullarticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullarticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullarticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
