export interface ExamplePrompt {
  category: string;
  icon: string;
  prompts: string[];
}

export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    category: 'Modern Angular',
    icon: 'bolt',
    prompts: [
      'How do I convert a component to use Signals?',
      'Explain the new Control Flow syntax (@if, @for).',
      'What are the benefits of Zoneless Angular?',
    ],
  },
  {
    category: 'Best Practices',
    icon: 'verified',
    prompts: [
      'What is the recommended way to handle HTTP errors?',
      'How do I implement lazy loading with standalone components?',
    ],
  },
  {
    category: 'Angular Material',
    icon: 'palette',
    prompts: [
      'How do I set up a custom theme with Material 3?',
      'Show me how to use MatDialog with standalone components.',
      'What are the best practices for responsive layouts with Material?',
    ],
  },
  {
    category: 'NgRX State',
    icon: 'data_object',
    prompts: [
      'How do I use SignalStore in NgRX?',
      'Show me how to implement Effects for API calls.',
      'What is the difference between Store and ComponentStore?',
    ],
  },
  {
    category: 'Debugging',
    icon: 'bug_report',
    prompts: [
      'Why is my signal not updating the view?',
      'Debug a circular dependency injection error.',
      'How do I fix "ExpressionChangedAfterItHasBeenCheckedError"?',
    ],
  },
  {
    category: 'Testing',
    icon: 'science',
    prompts: [
      'Write a unit test for a signal-based service.',
      'How do I test a component with asynchronous data?',
      'Show me how to use ComponentFixture.autoDetectChanges().',
    ],
  },
];
