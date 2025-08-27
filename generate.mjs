import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const INPUT_FILE = 'sudoku.csv'; // Change this to your file path
const CHUNK_SIZE = 18000;
const OUTPUT_DIR = 'data';

async function splitCSV() {
  try {
    // Create output directory if it doesn't exist
    await mkdir(OUTPUT_DIR, { recursive: true });
    
    console.log('Starting to process CSV file...');
    
    // Use Bun.file to create a readable stream
    const file = Bun.file(INPUT_FILE);
    const stream = file.stream();
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    
    let buffer = '';
    let chunkIndex = 1;
    let currentChunk = ''; // String instead of array
    let linesInCurrentChunk = 0;
    let isFirstLine = true;

    console.log('Processing file stream...');

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines
        let lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (!line.trim()) continue; // Skip empty lines
          
          // Skip the header (first line)
          if (isFirstLine) {
            isFirstLine = false;
            console.log('Header skipped, continuing...');
            continue;
          }

          // Add line to current chunk string
          currentChunk += line + '\n';
          linesInCurrentChunk++;

          // Write chunk when it reaches the desired size
          if (linesInCurrentChunk >= CHUNK_SIZE) {
            await writeChunk(currentChunk, chunkIndex);
            currentChunk = ''; // Reset chunk
            linesInCurrentChunk = 0;
            chunkIndex++;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Process any remaining data in buffer
    if (buffer.trim() && !isFirstLine) {
      currentChunk += buffer.trim() + '\n';
      linesInCurrentChunk++;
    }

    // Write the final chunk if it has data
    if (linesInCurrentChunk > 0) {
      await writeChunk(currentChunk, chunkIndex);
    }

    console.log(`\n✅ Processing complete!`);
    console.log(`Total chunks created: ${chunkIndex - (linesInCurrentChunk > 0 ? 0 : 1)}`);
    console.log(`Output directory: ${OUTPUT_DIR}`);

  } catch (error) {
    console.error('❌ Error processing file:', error.message);
    process.exit(1);
  }
}

async function writeChunk(chunkContent, chunkIndex) {
  const chunkFileName = `chunk_${String(chunkIndex).padStart(3, '0')}.csv`;
  const chunkPath = path.join(OUTPUT_DIR, chunkFileName);
  
  await Bun.write(chunkPath, chunkContent);
  console.log(`Chunk ${chunkIndex} created`);
}

// Run the script
splitCSV();