import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTestComponent } from './upload-test.component';

describe('UploadTestComponent', () => {
  let component: UploadTestComponent;
  let fixture: ComponentFixture<UploadTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
