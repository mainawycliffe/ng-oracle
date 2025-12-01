import { enableFirebaseTelemetry } from '@genkit-ai/firebase';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

enableFirebaseTelemetry();

initializeApp();
export const db = getFirestore();
