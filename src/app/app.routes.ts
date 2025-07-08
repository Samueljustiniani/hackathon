// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { FichasBibliograficasListComponent } from './feature/libros/libros-list/libros-list.component';
import { FichasBibliograficasFormComponent } from './feature/libros/libros-form/libros-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/fichas', pathMatch: 'full' },
  { path: 'fichas', component: FichasBibliograficasListComponent },
  { path: 'fichas/new', component: FichasBibliograficasFormComponent },
  { path: 'fichas/edit/:id', component: FichasBibliograficasFormComponent },
  { path: '**', redirectTo: '/fichas' } // Wildcard route for any unmatched path
];