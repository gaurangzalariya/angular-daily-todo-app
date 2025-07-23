import { Component, signal, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
// import { RouterOutlet } from '@angular/router';
import { TodoListComponent } from './todo-list.component';
import { NgIf, NgClass } from '@angular/common';  

@Component({
  selector: 'app-root',
  imports: [TodoListComponent, NgIf, NgClass],
  template: `
    <div class="min-h-screen w-full transition-colors duration-300" [class.bg-zinc-900]="theme() === 'dark'" [class.bg-zinc-100]="theme() === 'light'">
      <button (click)="toggleTheme()"
        class="fixed top-3 right-3 z-50 flex items-center px-2 py-2 md:px-4 md:py-2 rounded-xl font-bold shadow hover:bg-zinc-900 dark:hover:bg-zinc-100 transition border border-zinc-200 dark:border-zinc-700 text-zinc-100 dark:text-zinc-700 cursor-pointer"
        [ngClass]="theme() === 'dark' ? 'bg-white' : 'bg-zinc-900'"
        aria-label="Toggle light/dark mode">
        <ng-container *ngIf="theme() === 'dark'; else showLight">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6 text-yellow-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1.5M12 19.5V21M4.219 4.219l1.061 1.061M17.657 17.657l1.061 1.061M3 12h1.5M19.5 12H21M4.219 19.781l1.061-1.061M17.657 6.343l1.061-1.061M12 7.5A4.5 4.5 0 1112 16.5a4.5 4.5 0 010-9z" />
          </svg>
          <span class="ml-2 hidden md:inline">Light Theme</span>
        </ng-container>
        <ng-template #showLight>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6 text-blue-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </svg>
          <span class="ml-2 hidden md:inline">Dark Theme</span>
        </ng-template>
      </button>
      <todo-list />
    </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  theme = signal(this.getInitialTheme());

  constructor(private meta: Meta, private title: Title) {}

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
    this.setSeoMeta();
  }

  setSeoMeta() {
    this.title.setTitle('Daily Todo List');
    this.meta.addTags([
      { name: 'description', content: 'Organize your day with nested todos and a beautiful, focused interface. This app is brought to you by Wonqy Media.' },
      { name: 'author', content: 'Wonqy Media' },
      { name: 'keywords', content: 'todo, daily, productivity, wonqy media, angular, task list' },
      { property: 'og:title', content: 'Daily Todo List' },
      { property: 'og:description', content: 'Organize your day with nested todos and a beautiful, focused interface. This app is brought to you by Wonqy Media.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Daily Todo List' }
    ]);
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
