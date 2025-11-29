import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

import 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-typescript';

import ClipboardJS from 'clipboard';
(window as any).ClipboardJS = ClipboardJS;

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
