import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-response-display',
  imports: [MatCardModule, MatProgressBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isLoading()) {
      <div class="loading-state" role="status" aria-live="polite">
        <mat-progress-bar mode="indeterminate" aria-label="Loading response"></mat-progress-bar>
        <p>Analyzing your {{ mode() }}...</p>
      </div>
    }

    @if (response()) {
      <div class="response-section" role="region" aria-label="Response" animate.enter>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Response</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="response-content" aria-live="polite">
              {{ response() }}
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    }
  `,
  styles: [`
    .loading-state {
      background: var(--mat-sys-surface);
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      margin-bottom: 2rem;

      mat-progress-bar {
        margin-bottom: 1rem;
        border-radius: 8px;
      }

      p {
        color: var(--mat-sys-on-surface-variant);
        font-size: 1rem;
        margin: 0;
      }
    }

    .response-section {
      animation: slideIn 0.3s ease;

      mat-card {
        border-radius: 24px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);

        mat-card-header {
          padding: 1.5rem 1.5rem 0;

          mat-card-title {
            font-size: 1.25rem;
            font-weight: 600;
          }
        }

        mat-card-content {
          padding: 1.5rem;
        }
      }

      .response-content {
        font-size: 1rem;
        line-height: 1.7;
        color: var(--mat-sys-on-surface);
        white-space: pre-wrap;
      }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ResponseDisplayComponent {
  isLoading = input.required<boolean>();
  response = input.required<string>();
  mode = input.required<string>();
}
