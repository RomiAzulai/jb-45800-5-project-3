import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { getMcpTools, handleMcpToolCall } from '../controllers/mcpController';

dotenv.config();

async function main() {
  const server = new Server(
    {
      name: 'vacations-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: getMcpTools(),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === 'query_vacations_db') {
      const question = (args as { question: string }).question;
      const answer = await handleMcpToolCall(question);
      return {
        content: [{ type: 'text', text: answer }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Vacations MCP Server running on stdio');
}

main().catch(console.error);
