import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeStore } from '@neo-scout/stores/theme';
import { Button } from 'primeng/button';

@Component({
  selector: 'neo-home',
  imports: [NgOptimizedImage, RouterLink, Button],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export class Home {
  private readonly themeStore = inject(ThemeStore);

  readonly logoLgSrc = computed(() =>
    this.themeStore.mode() === 'dark'
      ? 'brand/logo-lg-dark.svg'
      : 'brand/logo-lg.svg',
  );
}
