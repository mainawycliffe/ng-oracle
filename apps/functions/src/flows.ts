import { ai } from './genkit';
import { buildPrompt } from './prompts';
import {
  oracleInputSchema,
  oracleOutputSchema,
  oracleResponseSchema,
} from './schemas';
import { searchAngularDocs, searchMaterialDocs, searchNgrxDocs } from './tools';

export const theOracleFlow = ai.defineFlow(
  {
    name: 'theOracle',
    inputSchema: oracleInputSchema,
    outputSchema: oracleOutputSchema,
  },
  async (input) => {
    const { query, angularVersion, mode, history, image, learningMode } = input;

    const { system, prompt } = buildPrompt(
      mode,
      query,
      angularVersion,
      learningMode,
    );

    const messages = (history || []).map((m) => ({
      role: m.role,
      content: [
        {
          text:
            typeof m.content === 'string'
              ? m.content
              : JSON.stringify(m.content),
        },
      ],
    }));

    const userContent = [{ text: prompt }];
    if (image) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userContent.push({ text: '', media: { url: image } } as any);
    }

    messages.push({
      role: 'user',
      content: userContent,
    });

    const response = await ai.generate({
      system,
      messages,
      tools: [searchAngularDocs, searchMaterialDocs, searchNgrxDocs],
      output: { schema: oracleResponseSchema },
      config: {
        temperature: 0.5,
      },
    });

    return {
      response: response.output,
    };
  },
);
