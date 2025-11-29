import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';
import { ModeInputComponent } from './components/mode-input.component';
import {
  ModeSelectorComponent,
  type Mode,
} from './components/mode-selector.component';
import { ResponseDisplayComponent } from './components/response-display.component';
import { OracleService } from './services/oracle.service';

interface AngularVersion {
  value: string;
  label: string;
}

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    FooterComponent,
    ModeSelectorComponent,
    ModeInputComponent,
    ResponseDisplayComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-container">
      <app-header
        [selectedVersion]="selectedVersion()"
        [versions]="angularVersions"
        (versionChange)="selectedVersion.set($event)"
      />

      <main class="main-content" role="main">
        <app-mode-selector
          [selectedMode]="selectedMode()"
          (modeChange)="selectedMode.set($event)"
        />

        <div class="content-area">
          <app-mode-input
            [title]="modeConfig().title"
            [description]="modeConfig().description"
            [label]="modeConfig().label"
            [placeholder]="modeConfig().placeholder"
            [buttonText]="modeConfig().buttonText"
            [icon]="modeConfig().icon"
            [ariaLabel]="modeConfig().ariaLabel"
            [submitLabel]="modeConfig().submitLabel"
            [isCode]="modeConfig().isCode"
            [rows]="modeConfig().rows"
            [minRows]="modeConfig().minRows"
            [maxRows]="modeConfig().maxRows"
            [inputText]="inputText()"
            (inputChange)="inputText.set($event)"
            (submit)="handleSubmit()"
            (clear)="clearInput()"
          />

          <app-response-display
            [isLoading]="isLoading()"
            [response]="response()"
            [mode]="selectedMode()"
          />
        </div>
      </main>

      <app-footer />
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: linear-gradient(135deg, #fef5f7 0%, #f8e8eb 100%);
      }

      .main-content {
        flex: 1;
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        padding: 2rem 1rem;

        @media (min-width: 768px) {
          padding: 3rem 2rem;
        }
      }
    `,
  ],
})
export class App {
  private oracleService = inject(OracleService);
  private platformId = inject(PLATFORM_ID);

  // State signals
  selectedMode = signal<Mode>('question');
  selectedVersion = signal<string>(this.getInitialVersion());
  inputText = signal<string>('');
  isLoading = signal<boolean>(false);
  response = signal<string>('');

  // Available Angular versions
  angularVersions: AngularVersion[] = [
    { value: '21', label: 'Angular 21 (Latest)' },
    { value: '20', label: 'Angular 20' },
    { value: '19', label: 'Angular 19' },
    { value: '18', label: 'Angular 18' },
  ];

  constructor() {
    effect(() => {
      const version = this.selectedVersion();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('ng-lens-version', version);
      }
    });
  }

  private getInitialVersion(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('ng-lens-version') || '21';
    }
    return '21';
  }

  // Mode configuration
  modeConfig = computed(() => {
    const mode = this.selectedMode();
    switch (mode) {
      case 'question':
        return {
          title: 'Ask a Question',
          description: 'Get instant answers from Angular documentation',
          label: 'Your question',
          placeholder: 'e.g., How do I create a standalone component?',
          buttonText: 'Ask Question',
          icon: 'search',
          ariaLabel: 'Enter your Angular question',
          submitLabel: 'Submit question',
          isCode: false,
          rows: 4,
          minRows: 4,
          maxRows: 12,
        };
      case 'error':
        return {
          title: 'Paste Error',
          description: 'Get help understanding and fixing Angular errors',
          label: 'Error message or stack trace',
          placeholder: 'Paste your error message or stack trace here...',
          buttonText: 'Analyze Error',
          icon: 'bug_report',
          ariaLabel: 'Paste error message or stack trace',
          submitLabel: 'Analyze error',
          isCode: true,
          rows: 8,
          minRows: 8,
          maxRows: 20,
        };
      case 'review':
        return {
          title: 'Code Review',
          description: 'Get feedback on your Angular code with best practices',
          label: 'Your Angular code',
          placeholder:
            'Paste your Angular component, service, or module code here...',
          buttonText: 'Review Code',
          icon: 'rate_review',
          ariaLabel: 'Paste your Angular code for review',
          submitLabel: 'Submit code for review',
          isCode: true,
          rows: 12,
          minRows: 12,
          maxRows: 25,
        };
    }
  });

  handleSubmit(): void {
    const input = this.inputText().trim();
    if (!input) return;

    this.isLoading.set(true);
    this.response.set('');

    this.oracleService
      .stream({
        query: input,
        angularVersion: this.selectedVersion(),
        mode: this.selectedMode(),
      })
      .subscribe({
        next: (result) => {
          this.isLoading.set(false);
          this.response.set(result.response);
        },
        error: (error) => {
          console.error('Error calling Oracle:', error);
          this.response.set('Sorry, something went wrong. Please try again.');
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  clearInput(): void {
    this.inputText.set('');
    this.response.set('');
  }
}
