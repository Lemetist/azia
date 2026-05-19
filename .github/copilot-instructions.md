# Figma MCP Integration

This project is configured with Figma MCP support for use with GitHub Copilot CLI.

## Setup

Your Figma MCP is already installed and configured. To activate it:

1. **Create a Figma API Token:**
   - Go to: https://www.figma.com/settings/tokens
   - Create a new personal access token
   - Copy the token

2. **Add your token:**
   ```bash
   ~/setup-figma-token.sh
   ```

3. **Start using Figma with Copilot:**
   ```bash
   copilot
   ```

## Available with Figma MCP

- Access and analyze your Figma designs
- Extract design tokens and components
- Generate code from designs
- Automate design workflows

## Project Information

- **Team ID:** 1561672056987415961
- **User ID:** 1554841764151798557
- **Figma Team URL:** https://www.figma.com/files/team/1561672056987415961/recents-and-sharing

## Configuration

- MCP Server: `claude-talk-to-figma-mcp` (v0.9.2)
- Config File: `~/.copilot/mcp-config.json`
- Token File: `~/.copilot/.env.figma`
