import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Scout } from './scout';

describe('Scout', () => {
  let component: Scout;
  let fixture: ComponentFixture<Scout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scout],
    }).compileComponents();

    fixture = TestBed.createComponent(Scout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
