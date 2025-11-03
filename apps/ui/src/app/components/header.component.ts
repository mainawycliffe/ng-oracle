import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

interface AngularVersion {
  value: string;
  label: string;
}

@Component({
  selector: 'app-header',
  imports: [MatFormFieldModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="app-header" role="banner">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="logo">
            <span class="logo-icon" aria-hidden="true">🔍</span>
            <span class="logo-text">ng-lens</span>
          </h1>
          <span class="tagline" role="doc-subtitle">AI-powered Angular documentation assistant</span>
        </div>

        <div class="header-actions">
          <mat-form-field appearance="outline" class="version-selector">
            <mat-label>Angular Version</mat-label>
            <mat-select 
              [value]="selectedVersion()" 
              (valueChange)="versionChange.emit($event)"
              aria-label="Select Angular version">
              @for (version of versions(); track version.value) {
                <mat-option [value]="version.value">
                  {{ version.label }}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background: var(--mat-sys-surface);
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      padding: 1rem 2rem;
      position: sticky;
      top: 0;
      z-index: 100;

      .header-content {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
      }

      .logo-section {
        display: flex;
        align-items: center;
        gap: 1.5rem;

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--mat-sys-primary);
          margin: 0;

          .logo-icon {
            font-size: 2rem;
          }

          .logo-text {
            background: linear-gradient(135deg, #dd0031 0%, #c3002f 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        }

        .tagline {
          color: var(--mat-sys-on-surface-variant);
          font-size: 0.875rem;
          display: none;

          @media (min-width: 768px) {
            display: inline;
          }
        }
      }

      .version-selector {
        min-width: 180px;
        margin: 0;
      }
    }

    @media (max-width: 768px) {
      .app-header {
        padding: 1rem;

        .header-content {
          flex-direction: column;
          gap: 1rem;
        }

        .logo-section {
          flex-direction: column;
          gap: 0.5rem;
          text-align: center;
        }

        .header-actions {
          width: 100%;

          .version-selector {
            width: 100%;
            max-width: 300px;
          }
        }
      }
    }
  `]
})
export class HeaderComponent {
  selectedVersion = input.required<string>();
  versions = input.required<AngularVersion[]>();
  versionChange = output<string>();
}
