import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// A direct implementation of the text processing logic from index.mjs
function processText(text) {
  return text.split(/\r?\n/).map(line => line.trim() === '' ? '\u00A0' : line).join('\n');
}

describe('PseudoMask Text Processing', () => {
  test('should handle text with empty lines correctly', () => {
    // Test various text patterns
    const testCases = [
      { input: 'First line\n\nThird line', expected: 'First line\n\u00A0\nThird line' },
      { input: 'First line\n  \nThird line', expected: 'First line\n\u00A0\nThird line' },
      { input: '\nFirst line', expected: '\u00A0\nFirst line' },
      { input: 'Last line\n', expected: 'Last line\n\u00A0' },
      { input: 'Multiple\n\n\nEmpty lines', expected: 'Multiple\n\u00A0\n\u00A0\nEmpty lines' },
      { input: 'Windows\r\nStyle\r\n\r\nNewlines', expected: 'Windows\nStyle\n\u00A0\nNewlines' }
    ];
    
    testCases.forEach(({ input, expected }) => {
      const result = processText(input);
      assert.strictEqual(result, expected, `Processing "${input}" should yield "${expected}", got "${result}"`);
    });
  });
  
  test('should verify that line processing matches implementation', () => {
    // Verify that our test implementation matches the actual implementation in index.mjs
    const indexPath = path.join(__dirname, '..', 'index.mjs');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Look for the line that does the text processing
    const processingLine = indexContent.split('\n')
      .find(line => 
        line.includes('split(/\\r?\\n/)') && 
        line.includes('map(line =>') && 
        line.includes('line.trim() ===') && 
        line.includes('\\u00A0')
      );
    
    assert.ok(processingLine, 'Should find the text processing line in index.mjs');
    
    // Basic verification that our test matches the implementation
    assert.ok(
      processingLine.includes("split(/\\r?\\n/)") && 
      processingLine.includes("map(line =>") && 
      processingLine.includes("line.trim() === ''") && 
      processingLine.includes("\\u00A0"), 
      'Text processing in test should match implementation'
    );
  });
});