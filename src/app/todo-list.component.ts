import { Component, input, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { NgIf, NgForOf, NgTemplateOutlet } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import Cookies from 'js-cookie';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  children?: Todo[];
}

@Component({
  selector: 'todo-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgForOf, NgTemplateOutlet, DragDropModule],
  template: `
    <section class="w-full h-full min-h-screen bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors flex flex-col">
      <div class="flex flex-col items-center pt-6 pb-4 px-2 md:pt-16 md:pb-10 md:px-6">
        <span class="inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-2 md:mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 md:w-14 md:h-14 text-blue-600 dark:text-blue-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75v10.5A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25M2.25 6.75l9.72 7.29a2.25 2.25 0 002.58 0l9.72-7.29" />
          </svg>
        </span>
        <h2 class="text-2xl md:text-5xl font-extrabold text-center text-blue-700 dark:text-blue-300 tracking-tight mb-1 md:mb-2">Daily Todo List</h2>
        <p class="text-base md:text-lg text-zinc-600 dark:text-zinc-400 text-center">Organize your day with nested todos and a beautiful, focused interface.</p>
        <div class="flex flex-col gap-2 mt-4 md:flex-row md:gap-4 md:mt-6 w-full max-w-xs md:max-w-none justify-center">
          <button (click)="startNewDay()" class="px-4 py-2 md:px-6 md:py-2 rounded-xl bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-bold text-base md:text-lg shadow hover:bg-red-200 dark:hover:bg-red-800 transition flex items-center gap-2 justify-center cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Start New Day
          </button>
          <button (click)="showCompleted.set(!showCompleted())" class="px-4 py-2 md:px-6 md:py-2 rounded-xl bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-bold text-base md:text-lg shadow hover:bg-green-200 dark:hover:bg-green-800 transition flex items-center gap-2 justify-center cursor-pointer">
            <svg *ngIf="!showCompleted()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6">
              <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="2.5" fill="none" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 12l2.5 2.5L16 9" />
            </svg>
            <svg *ngIf="showCompleted()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18M10.5 10.5a3.5 3.5 0 014.95 4.95M9.17 9.17A3.5 3.5 0 0112 7.5c1.93 0 3.5 1.57 3.5 3.5 0 .83-.3 1.59-.8 2.18" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 17H7a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4z" />
            </svg>
            {{ showCompleted() ? 'Hide Completed' : 'Show Completed' }}
          </button>
        </div>
      </div>
      <form (submit)="addTodo()" aria-label="Add todo" class="flex gap-2 md:gap-4 mb-6 md:mb-10 justify-center px-2 md:px-6 w-full max-w-md md:max-w-6xl mx-auto">
        <input
          type="text"
          [value]="newTodo()"
          (input)="onInput($event)"
          placeholder="What needs to be done?"
          aria-label="Todo text"
          class="w-full flex-1 px-4 py-3 md:px-8 md:py-6 text-lg md:text-3xl rounded-2xl md:rounded-3xl border-2 border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-blue-300 transition shadow-lg"
        />
        <button type="submit" class="flex items-center gap-2 px-6 py-3 md:px-10 md:py-6 rounded-2xl md:rounded-3xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-lg md:text-3xl font-bold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6 md:w-8 md:h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </form>
      <ul class="space-y-3 md:space-y-6 px-2 md:px-6 w-full max-w-md md:max-w-6xl mx-auto" cdkDropList (cdkDropListDropped)="dropMain($event)">
        <li *ngFor="let todo of filteredTodos(todos()); trackBy: trackById" cdkDrag>
          <div class="flex items-start gap-2 md:gap-4 group bg-zinc-50 dark:bg-zinc-700 rounded-xl md:rounded-2xl px-3 py-2 md:px-6 md:py-4 shadow-lg transition hover:shadow-2xl border border-zinc-200 dark:border-zinc-600">
            <button type="button" (click)="toggleTodo(todo.id)" aria-label="Mark as completed" class="mt-1 mr-1 md:mr-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer">
              <svg *ngIf="!todo.completed" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6 md:w-8 md:h-8 text-zinc-400 group-hover:text-blue-600 dark:text-zinc-600 dark:group-hover:text-blue-400 transition">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" fill="none" />
              </svg>
              <svg *ngIf="todo.completed" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400 transition">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" fill="none" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 12l2.5 2.5L16 9" />
              </svg>
            </button>
            <span [class.line-through]="todo.completed" [class.text-zinc-400]="todo.completed" class="flex-1 text-base md:text-2xl text-zinc-900 dark:text-zinc-100 font-semibold transition-all">{{ todo.text }}</span>
            <button type="button" (click)="removeTodo(todo.id)" aria-label="Remove todo" class="ml-1 md:ml-2 text-red-400 hover:text-red-600 focus:text-red-600 p-1 md:p-2 rounded-full transition-colors focus:outline-none cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 md:w-7 md:h-7">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button type="button" (click)="toggleChildInput(todo.id)" aria-label="Add sub-todo" class="ml-1 text-blue-500 hover:text-blue-700 focus:text-blue-700 p-1 md:p-2 rounded-full transition cursor-pointer" [attr.aria-expanded]="showChildInput[todo.id]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 md:w-7 md:h-7">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <form *ngIf="showChildInput[todo.id]" (submit)="addChildTodo(todo.id, $event)" class="flex gap-1 md:gap-2 mt-2 md:mt-4 ml-6 md:ml-12">
            <input
              type="text"
              [value]="childInputs[todo.id] || ''"
              (input)="onChildInput(todo.id, $event)"
              (blur)="onChildInputBlur(todo.id)"
              (keydown.escape)="onChildInputEscape(todo.id)"
              placeholder="Add sub-todo"
              aria-label="Child todo text"
              class="flex-1 px-2 py-2 md:px-4 md:py-3 text-base md:text-xl rounded-lg md:rounded-xl border-2 border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
            />
            <button type="submit" class="px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-base md:text-xl font-bold shadow transition flex items-center gap-1 md:gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </form>
          <ul *ngIf="todo.children && todo.children.length" class="pl-4 md:pl-10 mt-2 md:mt-4 border-l-2 md:border-l-4 border-zinc-200 dark:border-zinc-600" cdkDropList (cdkDropListDropped)="dropChild($event, todo, todo.children ? todo.children : [])">
            <ng-container *ngTemplateOutlet="recursiveList; context: { $implicit: todo.children, parent: todo }"></ng-container>
          </ul>
        </li>
      </ul>
      <ng-template #recursiveList let-todos let-parent="parent">
        <li *ngFor="let child of filteredTodos(todos); trackBy: trackById" cdkDrag>
          <div class="flex items-start gap-2 md:gap-4 group bg-zinc-100 dark:bg-zinc-700 rounded-xl md:rounded-2xl px-3 py-2 md:px-6 md:py-4 shadow-lg transition hover:shadow-2xl border border-zinc-200 dark:border-zinc-600">
            <button type="button" (click)="toggleTodo(child.id, todos)" aria-label="Mark as completed" class="mt-1 mr-1 md:mr-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer">
              <svg *ngIf="!child.completed" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6 md:w-8 md:h-8 text-zinc-400 group-hover:text-blue-600 dark:text-zinc-600 dark:group-hover:text-blue-400 transition">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" fill="none" />
              </svg>
              <svg *ngIf="child.completed" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400 transition">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" fill="none" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 12l2.5 2.5L16 9" />
              </svg>
            </button>
            <span [class.line-through]="child.completed" [class.text-zinc-400]="child.completed" class="flex-1 text-base md:text-xl text-zinc-900 dark:text-zinc-100 font-semibold transition-all">{{ child.text }}</span>
            <button type="button" (click)="removeTodo(child.id, todos)" aria-label="Remove todo" class="ml-1 md:ml-2 text-red-400 hover:text-red-600 focus:text-red-600 p-1 md:p-2 rounded-full transition-colors focus:outline-none cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 md:w-7 md:h-7">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button type="button" (click)="toggleChildInput(child.id)" aria-label="Add sub-todo" class="ml-1 text-blue-500 hover:text-blue-700 focus:text-blue-700 p-1 md:p-2 rounded-full transition cursor-pointer" [attr.aria-expanded]="showChildInput[child.id]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 md:w-7 md:h-7">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <form *ngIf="showChildInput[child.id]" (submit)="addChildTodo(child.id, $event, todos)" class="flex gap-1 md:gap-2 mt-2 md:mt-4 ml-6 md:ml-12">
            <input
              type="text"
              [value]="childInputs[child.id] || ''"
              (input)="onChildInput(child.id, $event)"
              (blur)="onChildInputBlur(child.id)"
              (keydown.escape)="onChildInputEscape(child.id)"
              placeholder="Add sub-todo"
              aria-label="Child todo text"
              class="flex-1 px-2 py-2 md:px-4 md:py-3 text-base md:text-xl rounded-lg md:rounded-xl border-2 border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow"
            />
            <button type="submit" class="px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-base md:text-xl font-bold shadow transition flex items-center gap-1 md:gap-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 md:w-6 md:h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </form>
          <ul *ngIf="child.children && child.children.length" class="pl-4 md:pl-10 mt-2 md:mt-4 border-l-2 md:border-l-4 border-zinc-200 dark:border-zinc-600" cdkDropList (cdkDropListDropped)="dropChild($event, child, child.children ? child.children : [])">
            <ng-container *ngTemplateOutlet="recursiveList; context: { $implicit: child.children, parent: child }"></ng-container>
          </ul>
        </li>
      </ng-template>
      <p *ngIf="todos().length === 0" class="text-center text-zinc-400 dark:text-zinc-500 mt-8 md:mt-16 text-lg md:text-2xl font-semibold px-2 md:px-6">No todos for today!</p>
      
      <!-- Footer -->
      <footer class="mt-auto pt-8 md:pt-16 pb-4 md:pb-8 px-2 md:px-6 text-center">
        <div class="max-w-xs md:max-w-4xl mx-auto flex flex-col items-center md:flex-row justify-center gap-2 md:gap-4 align-center">
          <p class="text-zinc-600 dark:text-zinc-400 text-base md:text-lg">
            This app is brought to you by 
            <a href="https://wonqymedia.com" target="_blank" rel="noopener noreferrer" 
               class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors">
              Wonqy Media
            </a>
          </p>
          <div class="flex items-center justify-center gap-1 md:gap-2 text-zinc-600 dark:text-zinc-400">
            <span class="text-base md:text-lg">Made with love in India with</span>
            <a href="https://angular.io" target="_blank" rel="noopener noreferrer" 
               class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold transition-colors flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 md:w-6 md:h-6">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2zM12 4.236l7.5 3.764v7.5L12 19.236l-7.5-3.736v-7.5L12 4.236z"/>
                <path d="M12 6.472L6 9.236v5.528L12 17.528l6-2.764V9.236L12 6.472z"/>
              </svg>
              Angular
            </a>
          </div>
        </div>
      </footer>
    </section>
  `,
  styles: []
})
export class TodoListComponent {
  todos = signal<Todo[]>(this.loadTodos());
  newTodo = signal('');
  childInputs: Record<number, string> = {};
  showChildInput: Record<number, boolean> = {};
  showCompleted = signal(false);

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.newTodo.set(value);
  }

  onChildInput(id: number, event: Event) {
    this.childInputs[id] = (event.target as HTMLInputElement).value;
  }

  onChildInputBlur(id: number) {
    if (!this.childInputs[id] || this.childInputs[id].trim() === '') {
      this.showChildInput[id] = false;
    }
  }
  onChildInputEscape(id: number) {
    this.showChildInput[id] = false;
  }

  // Utility to ensure all todos and sub-todos have a children array
  ensureChildren(todos: Todo[]): Todo[] {
    return todos.map(todo => ({
      ...todo,
      children: todo.children ? this.ensureChildren(todo.children) : []
    }));
  }

  loadTodos(): Todo[] {
    try {
      const raw = Cookies.get('todos');
      const parsed = raw ? JSON.parse(raw) : [];
      return this.ensureChildren(parsed);
    } catch {
      return [];
    }
  }

  saveTodos() {
    Cookies.set('todos', JSON.stringify(this.todos()), { expires: 7 });
  }

  addTodo() {
    const text = this.newTodo().trim();
    if (!text) return false;
    const next: Todo = {
      id: Date.now(),
      text,
      completed: false,
      children: []
    };
    this.todos.update(tds => [next, ...tds]);
    this.newTodo.set('');
    this.saveTodos();
    return false;
  }

  addChildTodo(parentId: number, event: Event, list?: Todo[]) {
    event.preventDefault();
    const input = this.childInputs[parentId]?.trim();
    if (!input) return false;
    const addToList = (todos: Todo[]): boolean => {
      for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];
        if (todo.id === parentId) {
          const newChild: Todo = { id: Date.now(), text: input, completed: false, children: [] };
          const newChildren = [newChild, ...(todo.children || [])];
          todos[i] = { ...todo, children: newChildren };
          this.childInputs[parentId] = '';
          return true;
        }
        if (todo.children && addToList(todo.children)) {
          todos[i] = { ...todo, children: [...todo.children] };
          return true;
        }
      }
      return false;
    };
    this.todos.update(tds => { addToList(list || tds); return [...tds]; });
    this.saveTodos();
    return false;
  }

  toggleTodo(id: number, list?: Todo[]) {
    const toggle = (todos: Todo[]): boolean => {
      for (const todo of todos) {
        if (todo.id === id) {
          todo.completed = !todo.completed;
          return true;
        }
        if (todo.children && toggle(todo.children)) return true;
      }
      return false;
    };
    this.todos.update(tds => { toggle(list || tds); return [...tds]; });
    this.saveTodos();
  }

  removeTodo(id: number, list?: Todo[]) {
    const remove = (todos: Todo[]): boolean => {
      const idx = todos.findIndex(t => t.id === id);
      if (idx !== -1) {
        todos.splice(idx, 1);
        return true;
      }
      for (const todo of todos) {
        if (todo.children && remove(todo.children)) return true;
      }
      return false;
    };
    this.todos.update(tds => { remove(list || tds); return [...tds]; });
    this.saveTodos();
  }

  toggleChildInput(id: number) {
    this.showChildInput[id] = !this.showChildInput[id];
  }

  startNewDay() {
    this.todos.set([]);
    Cookies.remove('todos');
  }

  trackById(index: number, item: Todo) {
    return item.id;
  }

  // Add a computed to filter todos based on showCompleted
  filteredTodos(todos: Todo[]): Todo[] {
    if (this.showCompleted()) return todos;
    return todos.filter(todo => !todo.completed).map(todo => ({
      ...todo,
      children: todo.children ? this.filteredTodos(todo.children) : []
    }));
  }

  dropMain(event: CdkDragDrop<Todo[]>) {
    const arr = [...this.todos()];
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    this.todos.set(arr);
    this.saveTodos();
  }

  dropChild(event: CdkDragDrop<Todo[]>, parent: Todo, list: Todo[]) {
    const arr = [...list];
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    // Replace the parent's children with the new order
    if (parent) {
      // Find parent in the main tree and replace
      const updateChildren = (todos: Todo[]): boolean => {
        for (let i = 0; i < todos.length; i++) {
          if (todos[i].id === parent.id) {
            todos[i] = { ...todos[i], children: arr };
            return true;
          }
          // Remove the if (todos[i].children && ...) check and always call updateChildren with a non-undefined array
          if (updateChildren(todos[i].children ?? [])) {
            todos[i] = { ...todos[i], children: [...(todos[i].children ?? [])] };
            return true;
          }
        }
        return false;
      };
      this.todos.update(tds => { updateChildren(tds); return [...tds]; });
      this.saveTodos();
    }
  }
} 