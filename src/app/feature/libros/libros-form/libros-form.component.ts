import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FichasBibliograficasService } from '../../../core/services/libros.service';
import { FichaBibliografica } from '../../../core/interfaces/libros';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-fichas-bibliograficas-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './libros-form.component.html',
  styleUrls: ['./libros-form.component.scss']
})
export class FichasBibliograficasFormComponent implements OnInit {
  fichaForm: FormGroup;
  isEditMode = false;
  fichaId: number | null = null;

  // Actualización de los tipos de documento a solo 6.
  // Los valores (value) ahora están en minúsculas para coincidir con la restricción CHECK de la DB.
  // Las etiquetas (label) siguen siendo con mayúscula inicial para la UI.
  documentTypes: { label: string, value: string }[] = [
    { label: 'Libro', value: 'libro' },
    { label: 'Artículo', value: 'articulo' },
    { label: 'Tesis', value: 'tesis' },
    { label: 'Video', value: 'video' },
    { label: 'Periódico', value: 'periodico' },
    { label: 'Repositorio', value: 'repositorio' }
  ];

  // Definición de tipos de documento con campos reducidos (usando los valores en minúsculas)
  documentTypesWithReducedFields: string[] = ['video', 'periodico', 'repositorio'];

  constructor(
    private fb: FormBuilder,
    private fichasService: FichasBibliograficasService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    const textOnlyPattern = /^[a-zA-Z\s.,'()\-_áéíóúÁÉÍÓÚñÑüÜ]*$/;
    const normalCharPattern = /^[a-zA-Z0-9\s.,'()\-_áéíóúÁÉÍÓÚñÑüÜ]*$/;
    const numberOnlyPattern = /^\d*$/;

    this.fichaForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      autor: ['', [Validators.required, Validators.pattern(textOnlyPattern)]],
      titulo: ['', [Validators.required, Validators.pattern(normalCharPattern)]],
      anioPublicacion: [null, [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]],
      editorial: ['', [Validators.required, Validators.pattern(normalCharPattern)]],
      numeroEdicion: ['', [Validators.pattern(numberOnlyPattern)]],
      numeroPaginas: [null, [Validators.required, Validators.min(1)]],
      tema: ['', [Validators.required, Validators.pattern(textOnlyPattern)]]
    });
  }

  ngOnInit(): void {
    this.fichaId = this.route.snapshot.params['id'];
    if (this.fichaId) {
      this.isEditMode = true;
      this.fichasService.getFichaById(this.fichaId).subscribe({
        next: (data) => {
          // Al cargar la ficha, asegúrate de que el valor del tipoDocumento sea el correcto (minúsculas)
          // antes de parchear el formulario, si la DB guarda en minúsculas.
          // Si la DB guarda con mayúscula inicial, necesitarás convertirla a minúscula aquí.
          // Por simplicidad, asumimos que la DB espera minúsculas.
          const patchedData = { ...data, tipoDocumento: data.tipoDocumento.toLowerCase() };
          this.fichaForm.patchValue(patchedData);
          this.updateFormFieldsVisibility(patchedData.tipoDocumento);
        },
        error: (err) => {
          this.snackBar.open('Error al cargar la ficha.', 'Cerrar', { duration: 3000 });
          console.error(err);
          this.router.navigate(['/fichas']);
        }
      });
    }

    this.fichaForm.get('tipoDocumento')?.valueChanges.subscribe(tipo => {
      this.updateFormFieldsVisibility(tipo);
    });
  }

  private updateFormFieldsVisibility(tipoDocumento: string | null): void {
    const editorialControl = this.fichaForm.get('editorial');
    const numeroEdicionControl = this.fichaForm.get('numeroEdicion');
    const numeroPaginasControl = this.fichaForm.get('numeroPaginas');

    if (this.documentTypesWithReducedFields.includes(tipoDocumento || '')) {
      editorialControl?.clearValidators();
      editorialControl?.disable();
      editorialControl?.setValue('');

      numeroEdicionControl?.clearValidators();
      numeroEdicionControl?.disable();
      numeroEdicionControl?.setValue('');

      numeroPaginasControl?.clearValidators();
      numeroPaginasControl?.disable();
      numeroPaginasControl?.setValue(null);

    } else {
      editorialControl?.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9\s.,'()\-_áéíóúÁÉÍÓÚñÑüÜ]*$/)]);
      editorialControl?.enable();

      numeroEdicionControl?.setValidators([Validators.pattern(/^\d*$/)]);
      numeroEdicionControl?.enable();

      numeroPaginasControl?.setValidators([Validators.required, Validators.min(1)]);
      numeroPaginasControl?.enable();
    }

    editorialControl?.updateValueAndValidity();
    numeroEdicionControl?.updateValueAndValidity();
    numeroPaginasControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.fichaForm.valid) {
      // Asegurarse de que el tipoDocumento se envíe en minúsculas al backend
      const ficha: FichaBibliografica = {
        ...this.fichaForm.getRawValue(),
        tipoDocumento: this.fichaForm.get('tipoDocumento')?.value.toLowerCase() // <--- ¡CAMBIO CLAVE AQUÍ!
      };

      if (this.isEditMode && this.fichaId) {
        this.fichasService.updateFicha(this.fichaId, ficha).subscribe({
          next: () => {
            this.snackBar.open('Ficha actualizada correctamente.', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/fichas']);
          },
          error: (err) => {
            this.snackBar.open('Error al actualizar la ficha.', 'Cerrar', { duration: 3000 });
            console.error(err);
          }
        });
      } else {
        this.fichasService.createFicha(ficha).subscribe({
          next: () => {
            this.snackBar.open('Ficha creada correctamente.', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/fichas']);
          },
          error: (err) => {
            this.snackBar.open('Error al crear la ficha.', 'Cerrar', { duration: 3000 });
            console.error(err);
          }
        });
      }
    } else {
      this.fichaForm.markAllAsTouched();
      this.snackBar.open('Por favor, complete todos los campos requeridos.', 'Cerrar', { duration: 3000 });
    }
  }

  onCancel(): void {
    this.router.navigate(['/fichas']);
  }
}
