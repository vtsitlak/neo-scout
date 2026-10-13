import { TestBed } from '@angular/core/testing';
import { ThemeStore } from './theme.store';

describe('ThemeStore', () => {
  let store: ThemeStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(ThemeStore);
    store.setMode('light');
  });

  it('should default to light and toggle to dark', () => {
    // Arrange / Act
    expect(store.mode()).toBe('light');
    store.toggle();

    // Assert
    expect(store.mode()).toBe('dark');
  });

  it('should set mode explicitly', () => {
    // Arrange / Act
    store.setMode('dark');

    // Assert
    expect(store.mode()).toBe('dark');
  });
});
