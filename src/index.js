/**
 * LangChain CCS Integration
 * 
 * Provides LangChain tools for CCS receipt verification.
 * Allows AI agents to verify cryptographic commitment scheme receipts.
 * 
 * @example
 * ```javascript
 * import { CCSVerifierTool } from 'langchain-ccs';
 * 
 * const tool = new CCSVerifierTool();
 * const result = await tool.invoke({
 *   receipt: { receipt_id: "...", signature: "...", public_key: "..." }
 * });
 * ```
 */

import { Tool } from '@langchain/core/tools';
import { CCSVerifier } from 'ccs-verifier-mcp';

/**
 * LangChain tool for verifying CCS receipts.
 * 
 * This tool allows AI agents to verify the cryptographic integrity
 * of CCS (Cryptographic Commitment Scheme) receipts using Ed25519 signatures.
 */
export class CCSVerifierTool extends Tool {
  name = 'ccs_verify_receipt';
  description = `Verify a CCS (Cryptographic Commitment Scheme) receipt.
    
    Input: A JSON object with a 'receipt' field containing:
    - receipt_id (string, required): Unique receipt identifier
    - signature (string, required): Ed25519 signature (hex-encoded)
    - public_key (string, required): Ed25519 public key (hex-encoded)
    - evaluation_id (string, optional): Evaluation identifier
    - timestamp (number, optional): Unix timestamp in milliseconds
    - model_id (string, optional): Model identifier
    - prompt_hash (string, optional): SHA-256 hash of prompt
    - response_hash (string, optional): SHA-256 hash of response
    - commitments (array, optional): Array of commitment strings
    
    Output: JSON object with verification result:
    - valid (boolean): Whether the receipt is cryptographically valid
    - receipt_id (string): The receipt ID
    - checks (object): Detailed verification checks
    
    Example:
    {
      "receipt": {
        "receipt_id": "abc-123",
        "signature": "ed25519_signature_hex",
        "public_key": "ed25519_public_key_hex"
      }
    }`;

  constructor() {
    super();
    this.verifier = new CCSVerifier();
  }

  async _call(input) {
    try {
      const { receipt } = input;
      
      if (!receipt) {
        return JSON.stringify({
          error: 'Missing required field: receipt',
          valid: false
        });
      }

      const result = this.verifier.verify(receipt);
      
      return JSON.stringify({
        valid: result.valid,
        receipt_id: receipt.receipt_id || 'unknown',
        checks: result.checks || {},
        message: result.valid 
          ? 'Receipt is cryptographically valid' 
          : 'Receipt verification failed'
      });
    } catch (error) {
      return JSON.stringify({
        error: error.message,
        valid: false
      });
    }
  }
}

/**
 * LangChain tool for getting CCS verifier information.
 */
export class CCSVerifierInfoTool extends Tool {
  name = 'ccs_verifier_info';
  description = 'Get information about the CCS verifier (version, spec, usage stats)';

  constructor() {
    super();
    this.verifier = new CCSVerifier();
  }

  async _call(_input) {
    const info = {
      verifier: {
        version: this.verifier.version,
        spec_version: this.verifier.specVersion,
        license: 'CC0-1.0 (Public Domain)',
        description: 'Free, unlimited CCS receipt verification'
      },
      pricing: {
        verification: 'FREE (unlimited)',
        issuance: 'Contact Correctover for licensing',
        source_code: 'CC0-1.0 (self-hostable)'
      }
    };
    
    return JSON.stringify(info, null, 2);
  }
}

/**
 * Create all CCS tools for LangChain agent.
 * 
 * @returns {Tool[]} Array of CCS tools
 * 
 * @example
 * ```javascript
 * import { createCCSTools } from 'langchain-ccs';
 * import { createReactAgent } from 'langchain/agents';
 * 
 * const tools = createCCSTools();
 * const agent = createReactAgent({ llm: model, tools });
 * ```
 */
export function createCCSTools() {
  return [
    new CCSVerifierTool(),
    new CCSVerifierInfoTool()
  ];
}

// Default export for convenience
export default createCCSTools;
