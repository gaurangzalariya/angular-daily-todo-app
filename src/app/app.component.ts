import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { TodoListComponent } from './todo-list.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [TodoListComponent, NgIf],
  template: `
    <div class="min-h-screen w-full transition-colors duration-300" [class.bg-zinc-900]="theme() === 'dark'" [class.bg-zinc-100]="theme() === 'light'">
      <button (click)="toggleTheme()" class="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-bold shadow hover:bg-zinc-300 dark:hover:bg-zinc-700 transition">
        <svg *ngIf="theme() === 'light'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1.5M12 19.5V21M4.219 4.219l1.061 1.061M17.657 17.657l1.061 1.061M3 12h1.5M19.5 12H21M4.219 19.781l1.061-1.061M17.657 6.343l1.061-1.061M12 7.5A4.5 4.5 0 1112 16.5a4.5 4.5 0 010-9z" />
        </svg>
        <svg *ngIf="theme() === 'dark'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
        {{ theme() === 'dark' ? 'Dark' : 'Light' }} Mode
      </button>
      <todo-list />
    </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  theme = signal(this.getInitialTheme());

  getInitialTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      // Default: system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  ngOnInit() {
    this.applyThemeClass();
  }

  applyThemeClass() {
    if (typeof document !== 'undefined') {
      if (this.theme() === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  toggleTheme() {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    localStorage.setItem('theme', next);
    this.applyThemeClass();
  }
}
