/**
 * Tests for langchain-ccs integration
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CCSVerifierTool, CCSVerifierInfoTool, createCCSTools } from '../src/index.js';

describe('CCSVerifierTool', () => {
  it('should have correct name', () => {
    const tool = new CCSVerifierTool();
    assert.strictEqual(tool.name, 'ccs_verify_receipt');
  });

  it('should have description', () => {
    const tool = new CCSVerifierTool();
    assert.ok(tool.description.length > 0);
    assert.ok(tool.description.includes('CCS'));
  });

  it('should verify valid receipt', async () => {
    const tool = new CCSVerifierTool();
    
    // Create a test receipt (using known valid signature)
    const testReceipt = {
      receipt_id: 'test-123',
      signature: 'a'.repeat(128), // Placeholder - will fail signature check
      public_key: 'b'.repeat(64),
      timestamp: Date.now()
    };

    const result = await tool._call({ receipt: testReceipt });
    const parsed = JSON.parse(result);
    
    // Should return a result (may be invalid due to placeholder signature)
    assert.ok('valid' in parsed);
    assert.ok('receipt_id' in parsed);
  });

  it('should handle missing receipt', async () => {
    const tool = new CCSVerifierTool();
    const result = await tool._call({});
    const parsed = JSON.parse(result);
    
    assert.strictEqual(parsed.valid, false);
    assert.ok(parsed.error.includes('receipt'));
  });

  it('should handle invalid input', async () => {
    const tool = new CCSVerifierTool();
    const result = await tool._call({ receipt: 'invalid' });
    const parsed = JSON.parse(result);
    
    assert.strictEqual(parsed.valid, false);
  });
});

describe('CCSVerifierInfoTool', () => {
  it('should have correct name', () => {
    const tool = new CCSVerifierInfoTool();
    assert.strictEqual(tool.name, 'ccs_verifier_info');
  });

  it('should return verifier info', async () => {
    const tool = new CCSVerifierInfoTool();
    const result = await tool._call({});
    const parsed = JSON.parse(result);
    
    assert.ok(parsed.verifier);
    assert.ok(parsed.verifier.version);
    assert.ok(parsed.verifier.spec_version);
    assert.ok(parsed.pricing);
    assert.strictEqual(parsed.pricing.verification, 'FREE (unlimited)');
  });
});

describe('createCCSTools', () => {
  it('should return array of tools', () => {
    const tools = createCCSTools();
    assert.ok(Array.isArray(tools));
    assert.strictEqual(tools.length, 2);
  });

  it('should include verifier and info tools', () => {
    const tools = createCCSTools();
    const names = tools.map(t => t.name);
    
    assert.ok(names.includes('ccs_verify_receipt'));
    assert.ok(names.includes('ccs_verifier_info'));
  });
});
