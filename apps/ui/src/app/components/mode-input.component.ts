import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-mode-input',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TextFieldModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mode-content">
      <h2 class="mode-title">{{ title() }}</h2>
      <p class="mode-description">{{ description() }}</p>
      
      <mat-form-field appearance="outline" [class]="'input-field' + (isCode() ? ' code-field' : '')">
        <mat-label>{{ label() }}</mat-label>
        <textarea 
          matInput 
          [value]="inputText()"
          (input)="onInputChange($event)"
          [placeholder]="placeholder()"
          [rows]="rows()"
          cdkTextareaAutosize
          [cdkAutosizeMinRows]="minRows()"
          [cdkAutosizeMaxRows]="maxRows()"
          [class.code-input]="isCode()"
          [attr.aria-label]="ariaLabel()"></textarea>
      </mat-form-field>

      <div class="action-buttons">
        <button 
          mat-raised-button 
          color="primary" 
          [disabled]="!inputText().trim()"
          (click)="submit.emit()"
          [attr.aria-label]="submitLabel()">
          <mat-icon aria-hidden="true">{{ icon() }}</mat-icon>
          {{ buttonText() }}
        </button>
        <button mat-button (click)="clear.emit()" aria-label="Clear input">Clear</button>
      </div>
    </div>
  `,
  styles: [`
    .mode-content {
      background: var(--mat-sys-surface);
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
      margin-bottom: 2rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
      }
    }

    .mode-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--mat-sys-on-surface);
      margin: 0 0 0.5rem;
    }

    .mode-description {
      color: var(--mat-sys-on-surface-variant);
      font-size: 1rem;
      margin: 0 0 2rem;
    }

    .input-field {
      width: 100%;
      margin-bottom: 1.5rem;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:focus-within {
        transform: translateY(-2px);
      }

      textarea {
        font-size: 1rem;
        line-height: 1.6;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      &.code-field textarea {
        font-family: 'JetBrains Mono', Consolas, monospace;
        font-size: 0.875rem;
        line-height: 1.5;
      }
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      align-items: center;

      button {
        border-radius: 12px;
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        text-transform: none;
        font-size: 1rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        mat-icon {
          margin-right: 0.5rem;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        &:hover:not([disabled]) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);

          mat-icon {
            transform: scale(1.1);
          }
        }

        &:active:not([disabled]) {
          transform: translateY(0);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .mode-content {
        padding: 1.5rem;
      }
    }
  `]
})
export class ModeInputComponent {
  // Configuration inputs
  title = input.required<string>();
  description = input.required<string>();
  label = input.required<string>();
  placeholder = input.required<string>();
  buttonText = input.required<string>();
  icon = input.required<string>();
  ariaLabel = input.required<string>();
  submitLabel = input.required<string>();
  
  // Optional inputs with defaults
  isCode = input<boolean>(false);
  rows = input<number>(4);
  minRows = input<number>(4);
  maxRows = input<number>(12);
  
  // Input text signal
  inputText = input.required<string>();
  
  // Outputs
  inputChange = output<string>();
  submit = output<void>();
  clear = output<void>();

  onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.inputChange.emit(target.value);
  }
}
