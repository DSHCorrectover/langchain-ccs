# LangChain CCS Integration

[![License: CC0-1.0](https://img.shields.io/badge/License-CC0--1.0-blue.svg)](LICENSE)
[![npm version](https://badge.fury.io/js/langchain-ccs.svg)](https://badge.fury.io/js/langchain-ccs)

LangChain integration for CCS (Cryptographic Commitment Scheme) receipt verification.

## What is CCS?

CCS (Cryptographic Commitment Scheme) is an IETF standard for cryptographically verifying AI evaluation receipts. It uses Ed25519 signatures to provide proof that an AI evaluation occurred as claimed.

**Specification:** [draft-correctover-ccs-10](https://datatracker.ietf.org/doc/draft-correctover-ccs/)

## Installation

```bash
npm install langchain-ccs
```

## Quick Start

### Basic Usage

```javascript
import { CCSVerifierTool } from 'langchain-ccs';

const tool = new CCSVerifierTool();

const result = await tool.invoke({
  receipt: {
    receipt_id: 'abc-123',
    signature: 'ed25519_signature_hex',
    public_key: 'ed25519_public_key_hex',
    timestamp: 1699900000000,
    model_id: 'gpt-4'
  }
});

console.log(result);
// {"valid": true, "receipt_id": "abc-123", "checks": {...}}
```

### With LangChain Agent

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from 'langchain/agents';
import { createCCSTools } from 'langchain-ccs';

const model = new ChatOpenAI({ model: 'gpt-4' });
const tools = createCCSTools();

const agent = createReactAgent({ llm: model, tools });

const result = await agent.invoke({
  input: 'Verify this CCS receipt: {receipt_id: "abc-123", ...}'
});
```

### With LangGraph

```javascript
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { createCCSTools } from 'langchain-ccs';

const model = new ChatOpenAI({ model: 'gpt-4' });
const tools = createCCSTools();

const agent = createReactAgent({ model, tools });
```

## Available Tools

### `ccs_verify_receipt`

Verify a CCS receipt's cryptographic integrity.

**Input:**
```json
{
  "receipt": {
    "receipt_id": "string (required)",
    "signature": "string (required)",
    "public_key": "string (required)",
    "evaluation_id": "string (optional)",
    "timestamp": "number (optional)",
    "model_id": "string (optional)",
    "prompt_hash": "string (optional)",
    "response_hash": "string (optional)",
    "commitments": ["string"] (optional)
  }
}
```

**Output:**
```json
{
  "valid": true,
  "receipt_id": "abc-123",
  "checks": {
    "signature_valid": true,
    "format_valid": true,
    "timestamp_valid": true
  },
  "message": "Receipt is cryptographically valid"
}
```

### `ccs_verifier_info`

Get information about the CCS verifier.

**Output:**
```json
{
  "verifier": {
    "version": "1.0.0",
    "spec_version": "draft-correctover-ccs-10",
    "license": "CC0-1.0 (Public Domain)"
  },
  "pricing": {
    "verification": "FREE (unlimited)",
    "issuance": "Contact Correctover for licensing"
  }
}
```

## Why CCS?

- **Free forever** - Verification is a public good
- **Unlimited** - No rate limits, no API keys
- **Open source** - CC0 1.0 (public domain)
- **IETF Standard** - RFC path in progress
- **Ed25519** - Industry-standard cryptographic signatures

## License

CC0-1.0 (Public Domain) - See [LICENSE](LICENSE) file.

## Links

- [CCS Specification](https://datatracker.ietf.org/doc/draft-correctover-ccs/)
- [CCS Verifier MCP](https://github.com/DSHCorrectover/ccs-verifier-mcp)
- [Correctover](https://correctover.com)
