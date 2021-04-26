import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePostsComponent } from './article-posts.component';

describe('ArticlePostsComponent', () => {
  let component: ArticlePostsComponent;
  let fixture: ComponentFixture<ArticlePostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlePostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
