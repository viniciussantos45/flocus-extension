# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flocus is a Chrome extension built with Plasmo that helps users maintain focus by blocking distracting websites. When users attempt to access blocked sites, they are redirected to a motivational page that tracks blocks and encourages focus.

## Development Commands

```bash
# Start development server
pnpm dev

# Build production extension
pnpm build

# Package extension for distribution
pnpm package
```

After running `pnpm dev`, load the development build from `build/chrome-mv3-dev` in Chrome's extension manager.

## Architecture

### Core Components

**Background Service (`src/background.ts`)**
- Monitors all tab URL changes via `chrome.tabs.onUpdated`
- Maintains a hardcoded list of blocked URLs (youtube.com, facebook.com, twitter.com, instagram.com, reddit.com, gupy.io, linkedin.com)
- Redirects blocked sites to the block content page with the requested URL as a query parameter

**Block Content Page (`src/tabs/block-content.tsx`)**
- Full-page React component displayed when a blocked site is accessed
- Uses `@plasmohq/storage` for local storage (tracks daily block count)
- Displays site-specific info (icon, name) from `sites-info.ts`
- Shows motivational messages and productivity incentives
- Tracks time saved (seconds since block) and daily block count
- Allows users to request access by providing a reason (minimum 10 characters)

**Site Information (`src/tabs/sites-info.ts`)**
- Maps domains to display metadata (icon from Phosphor Icons, friendly name)
- Used to show branded icons and names on the block page

**Popup (`src/popup.tsx`)**
- Extension popup interface (currently placeholder from Plasmo template)

### Key Technologies

- **Plasmo Framework**: Chrome extension framework with HMR and React support
- **React 18**: UI component library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible UI primitives (Card, Button, Badge, Progress, Separator, Label, Textarea)
- **Phosphor Icons**: Icon library for site logos and UI icons
- **@plasmohq/storage**: Extension local storage wrapper

### Path Aliases

The project uses `~*` path alias that resolves to the root directory. Example:
- `~src/components/ui/button` → `/src/components/ui/button`

### Storage Schema

Uses `@plasmohq/storage` with local storage area:
- `todayBlocks` (number): Count of sites blocked today

### Adding New Blocked Sites

1. Add domain to `blockedUrls` array in `src/background.ts`
2. Add site metadata (icon, name) to `sitesInfo` object in `src/tabs/sites-info.ts`

### Extension Manifest

The extension requires `host_permissions` for `https://*/*` to monitor tab URLs (defined in `package.json` under `manifest` key).
