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
      'Show me how to structure a scalable Nx monorepo.',
      'What is the recommended way to handle HTTP errors?',
      'How do I implement lazy loading with standalone components?',
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
