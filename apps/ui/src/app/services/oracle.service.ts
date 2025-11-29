import { inject, Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable } from 'rxjs';

export interface OracleInput {
  query: string;
  angularVersion: string;
  mode: 'question' | 'error' | 'review';
}

export interface OracleResponse {
  response: string;
  sources?: string[];
}

interface StreamChunk {
  chunk: string;
}

@Injectable({
  providedIn: 'root',
})
export class OracleService {
  private functions = inject(Functions);

  stream(input: OracleInput): Observable<OracleResponse> {
    return new Observable<OracleResponse>((observer) => {
      const theOracle = httpsCallable<OracleInput, OracleResponse>(
        this.functions,
        'theOracle'
      );

      let accumulatedText = '';

      (async () => {
        try {
          const { stream, data } = await theOracle.stream(input);

          for await (const chunk of stream as AsyncIterable<StreamChunk>) {
            accumulatedText += chunk.chunk;
            observer.next({ response: accumulatedText });
          }

          const finalResult = await data;
          observer.next(finalResult);
          observer.complete();
        } catch (err) {
          observer.error(err);
        }
      })();
    });
  }
}
