import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Initialize Firebase
initializeApp();
const db = getFirestore();

// Initialize Genkit
const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash'),
});

// Define the embedder model
const embedder = googleAI.embedder('text-embedding-004');

interface DocChunk {
  id: string;
  version: string;
  path: string;
  title: string;
  content: string;
  embedding: number[];
  metadata: {
    section: string;
    url: string;
    tokens: number;
  };
  createdAt: Date;
}

// Parse markdown frontmatter and content
function parseMarkdown(content: string, filePath: string) {
  const lines = content.split('\n');
  let title = filePath.split('/').pop()?.replace('.md', '') || 'Untitled';
  
  // Extract title from first h1 or filename
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    title = h1Match[1];
  }

  return { title, content };
}

// Chunk content into smaller pieces for better retrieval
function chunkContent(content: string, maxTokens = 500): string[] {
  const chunks: string[] = [];
  const paragraphs = content.split(/\n\n+/);
  
  let currentChunk = '';
  let currentTokens = 0;

  for (const paragraph of paragraphs) {
    const paragraphTokens = Math.ceil(paragraph.length / 4); // Rough token estimate
    
    if (currentTokens + paragraphTokens > maxTokens && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = paragraph;
      currentTokens = paragraphTokens;
    } else {
      currentChunk += '\n\n' + paragraph;
      currentTokens += paragraphTokens;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Get all markdown files from a version directory
function getMarkdownFiles(versionDir: string): string[] {
  const files: string[] = [];

  function traverse(dir: string) {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  traverse(versionDir);
  return files;
}

// Generate embedding for a text chunk
async function generateEmbedding(text: string): Promise<number[] | undefined> {
  try {
    const result = await ai.embed({
      embedder,
      content: text,
    });
    
    return result.embedding;
  } catch (error) {
    console.error('    Error generating embedding:', error);
    return undefined;
  }
}

// Process a single version's documentation
async function processVersion(version: string, docsPath: string) {
  console.log(`\nProcessing Angular ${version}...`);
  
  const versionDir = join(docsPath, version);
  const files = getMarkdownFiles(versionDir);
  
  console.log(`Found ${files.length} markdown files`);

  let processedCount = 0;
  const batch = db.batch();
  let batchCount = 0;

  for (const filePath of files) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const relativePath = filePath.replace(versionDir + '/', '');
      const section = relativePath.split('/')[0];
      
      const { title } = parseMarkdown(content, filePath);
      const chunks = chunkContent(content);

      console.log(`  Processing: ${relativePath} (${chunks.length} chunks)`);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        
        // Generate embedding
        const embedding = await generateEmbedding(chunk);
        
        // Skip if embedding generation failed
        if (!embedding) {
          console.error(`    Skipping chunk ${i} - embedding generation failed`);
          continue;
        }

        // Create a sanitized document ID (replace special chars)
        const sanitizedPath = relativePath.replace(/[/.]/g, '-');
        const docId = `${version}_${sanitizedPath}_${i}`;

        const docChunk: DocChunk = {
          id: docId,
          version,
          path: relativePath,
          title,
          content: chunk,
          embedding,
          metadata: {
            section,
            url: `https://angular.dev/${relativePath.replace('.md', '')}`,
            tokens: Math.ceil(chunk.length / 4),
          },
          createdAt: new Date(),
        };

        const docRef = db.collection('angular-docs').doc(docId);
        batch.set(docRef, docChunk);
        
        batchCount++;
        
        // Firestore batch limit is 500 operations
        if (batchCount >= 450) {
          await batch.commit();
          console.log(`    Committed batch of ${batchCount} chunks`);
          batchCount = 0;
        }
      }

      processedCount++;
      
      // Rate limiting - avoid hitting API limits
      if (processedCount % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      console.error(`  Error processing ${filePath}:`, error);
    }
  }

  // Commit remaining items
  if (batchCount > 0) {
    await batch.commit();
    console.log(`  Committed final batch of ${batchCount} chunks`);
  }

  console.log(`✓ Completed Angular ${version}: ${processedCount} files processed`);
}

// Main execution
async function main() {
  const docsPath = join(process.cwd(), 'docs');
  const versions = ['v18', 'v19', 'v20'];

  console.log('Starting Angular documentation processing...');
  console.log('Docs path:', docsPath);

  for (const version of versions) {
    await processVersion(version, docsPath);
  }

  console.log('\n✓ All versions processed successfully!');
}

// Run the script
main().catch(console.error);
