import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactFormData } from '../../interfaces/contact-interface';


@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html'
})
export class ContactFormComponent implements OnInit {
  @Input() formTitle: string = 'Enviar Mensaje';
  @Input() formSubtitle: string = 'Te responderé en menos de 24 horas';
  @Input() submitText: string = 'Enviar Mensaje';
  @Input() successMessage = { title: '¡Éxito!', description: 'Mensaje enviado correctamente' };
  @Input() isSubmitting: boolean = false;
  @Input() showSuccess: boolean = false;
  
  @Output() formSubmit = new EventEmitter<ContactFormData>();
  @Output() inputFocus = new EventEmitter<string>();
  @Output() inputBlur = new EventEmitter<string>();

  contactForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.formSubmit.emit(this.contactForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    this.contactForm.reset();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo es obligatorio';
      if (field.errors['email']) return 'Ingresa un email válido';
      if (field.errors['minlength']) {
        const required = field.errors['minlength'].requiredLength;
        return `Mínimo ${required} caracteres requeridos`;
      }
    }
    return '';
  }

  onInputFocus(fieldName: string): void {
    this.inputFocus.emit(fieldName);
  }

  onInputBlur(fieldName: string): void {
    this.inputBlur.emit(fieldName);
  }
}
