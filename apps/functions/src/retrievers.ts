import { defineFirestoreRetriever } from '@genkit-ai/firebase';
import { vertexAI } from '@genkit-ai/vertexai';
import { db } from './config';
import { ai } from './genkit';

export const angularDocsRetriever = defineFirestoreRetriever(ai, {
  name: 'angularDocsRetriever',
  firestore: db,
  collection: 'angular-docs',
  contentField: 'content',
  vectorField: 'embedding',
  embedder: vertexAI.embedder('text-embedding-004'),
  distanceMeasure: 'COSINE',
});
