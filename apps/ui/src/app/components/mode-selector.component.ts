import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

export type Mode = 'question' | 'error' | 'review';

@Component({
  selector: 'app-mode-selector',
  imports: [MatButtonToggleModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mode-selector">
      <mat-button-toggle-group 
        [value]="selectedMode()" 
        (change)="modeChange.emit($event.value)"
        class="mode-toggle-group"
        aria-label="Select interaction mode">
        <mat-button-toggle value="question" aria-label="Ask a question about Angular">
          <mat-icon aria-hidden="true">help_outline</mat-icon>
          Ask Question
        </mat-button-toggle>
        <mat-button-toggle value="error" aria-label="Paste and analyze an error">
          <mat-icon aria-hidden="true">error_outline</mat-icon>
          Paste Error
        </mat-button-toggle>
        <mat-button-toggle value="review" aria-label="Get code review feedback">
          <mat-icon aria-hidden="true">code</mat-icon>
          Code Review
        </mat-button-toggle>
      </mat-button-toggle-group>
    </div>
  `,
  styles: [`
    .mode-selector {
      display: flex;
      justify-content: center;
      margin-bottom: 2.5rem;

      .mode-toggle-group {
        background: var(--mat-sys-surface);
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        padding: 4px;

        mat-button-toggle {
          border-radius: 12px;
          border: none;
          font-weight: 500;
          padding: 0.75rem 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          mat-icon {
            margin-right: 0.5rem;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          &.mat-button-toggle-checked {
            background: var(--mat-sys-primary-container);
            color: var(--mat-sys-on-primary-container);
            
            mat-icon {
              transform: scale(1.1);
            }
          }
        }
      }
    }

    @media (max-width: 768px) {
      .mode-selector .mode-toggle-group {
        flex-direction: column;
        width: 100%;

        mat-button-toggle {
          width: 100%;
        }
      }
    }
  `]
})
export class ModeSelectorComponent {
  selectedMode = input.required<Mode>();
  modeChange = output<Mode>();
}
