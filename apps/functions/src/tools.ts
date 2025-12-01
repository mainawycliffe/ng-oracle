import { z } from 'genkit';
import { ai } from './genkit';
import { angularDocsRetriever } from './retrievers';

export const searchAngularDocs = ai.defineTool(
  {
    name: 'searchAngularDocs',
    description:
      'Search the Angular documentation. Use this to find answers to user questions, analyze errors, or review code.',
    inputSchema: z.object({
      query: z.string().describe('The search query'),
      version: z.string().describe('The Angular version (e.g., "v18", "v19")'),
    }),
    outputSchema: z.object({
      results: z.array(
        z.object({
          content: z.string(),
          url: z.string().optional(),
        })
      ),
    }),
  },
  async ({ query, version }) => {
    const formattedVersion = version.startsWith('v') ? version : `v${version}`;
    const docs = await ai.retrieve({
      retriever: angularDocsRetriever,
      query,
      options: {
        where: {
          version: formattedVersion,
        },
        limit: 5,
      },
    });
    return {
      results: docs.map((d) => ({
        content: d.text,
        url: d.metadata?.url,
      })),
    };
  }
);
