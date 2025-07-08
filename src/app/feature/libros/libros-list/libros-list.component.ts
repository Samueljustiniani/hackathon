import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FichasBibliograficasService } from '../../../core/services/libros.service';
import { FichaBibliografica } from '../../../core/interfaces/libros';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fichas-bibliograficas-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './libros-list.component.html',
  styleUrls: ['./libros-list.component.scss']
})
export class FichasBibliograficasListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'idFicha',
    'tipoDocumento',
    'autor',
    'titulo',
    'anioPublicacion',
    'editorial',
    'numeroEdicion',
    'numeroPaginas',
    'tema',
    'fechaAgregada',
    'estado',
    'actions'
  ];
  dataSource = new MatTableDataSource<FichaBibliografica>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Opciones de paginación iniciales
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(
    private fichasService: FichasBibliograficasService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadFichas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadFichas(): void {
    this.fichasService.getAllFichas().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        // Lógica para añadir la opción "Todos" si hay más de 100 elementos
        // Se añade `data.length` para "Todos"
        const uniquePageSizeOptions = new Set([...this.pageSizeOptions, data.length]);
        this.pageSizeOptions = Array.from(uniquePageSizeOptions).sort((a, b) => a - b);
      },
      error: (err) => {
        this.snackBar.open('Error al cargar las fichas.', 'Cerrar', { duration: 3000 });
        console.error(err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editFicha(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/fichas/edit', id]);
    }
  }

  deleteFicha(id: number | undefined): void {
    if (id) {
      this.showConfirmDialog('¿Estás seguro de que quieres eliminar esta ficha? Esto la marcará como inactiva.', () => {
        this.fichasService.deleteFicha(id).subscribe({
          next: () => {
            this.snackBar.open('Ficha eliminada (inactivada) correctamente.', 'Cerrar', { duration: 3000 });
            this.loadFichas();
          },
          error: (err) => {
            this.snackBar.open('Error al eliminar la ficha.', 'Cerrar', { duration: 3000 });
            console.error(err);
          }
        });
      });
    }
  }

  restoreFicha(id: number | undefined): void {
    if (id) {
      this.showConfirmDialog('¿Estás seguro de que quieres restaurar esta ficha? Esto la marcará como activa.', () => {
        this.fichasService.restoreFicha(id).subscribe({
          next: () => {
            this.snackBar.open('Ficha restaurada correctamente.', 'Cerrar', { duration: 3000 });
            this.loadFichas();
          },
          error: (err) => {
            this.snackBar.open('Error al restaurar la ficha.', 'Cerrar', { duration: 3000 });
            console.error(err);
          }
        });
      });
    }
  }

  private showConfirmDialog(message: string, onConfirm: () => void): void {
    const snackBarRef = this.snackBar.open(message, 'Confirmar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    snackBarRef.onAction().subscribe(() => {
      onConfirm();
    });
  }

  downloadPdfReport(): void {
    this.fichasService.getPdfReport().subscribe({
      next: (data: Blob) => {
        const fileURL = URL.createObjectURL(data);
        window.open(fileURL, '_blank');
      },
      error: (err) => {
        this.snackBar.open('Error al generar el reporte PDF.', 'Cerrar', { duration: 3000 });
        console.error(err);
      }
    });
  }
}
