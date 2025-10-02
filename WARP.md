# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development

```bash
# Start development server
npm run dev

# Build the documentation site
npm run build

# Serve built site locally
npm run serve

# Format code with Prettier
npm run lint:fix

# Check formatting
npm run lint
```

### Git Workflow

This project follows the Gitflow branching model:

- All PRs should target the `develop` branch (not `main`)
- Use conventional commit format (enforced by commitlint)
- Pre-commit hooks run lint-staged for automatic formatting

### Commit Format

Follow conventional commits:

- `feat:` for new features
- `fix:` for bug fixes
- `chore:` for maintenance tasks
- `docs:` for documentation changes

## Architecture & Structure

### VitePress Documentation Site

This is a VitePress-powered documentation hub for The Sailscasts Company's ecosystem of tools and libraries.

**Key Files:**

- `docs/.vitepress/config.mjs` - Main VitePress configuration with navigation, sidebar, and site settings
- `docs/.vitepress/theme/index.js` - Custom theme extending VitePress default theme
- `docs/index.md` - Homepage with hero section and feature cards

### Content Organization

Documentation is organized by product/project in the `docs/` directory:

**Major Products:**

- `boring-stack/` - Full-stack Sails.js development framework
- `create-sails/` - Sails project scaffolding tool
- `inertia-sails/` - Sails adapter for Inertia.js
- `guppy/` - Backend JavaScript tinker tool
- `captain-vane/` - Sails factory generator for test data

**Additional Tools:**

- `content/` - Sails Content documentation
- `clearance/` - Sails Clearance documentation
- Various Sails hooks and plugins

### Navigation Configuration

The complex navigation structure is defined in `config.mjs` with functions like:

- `boringStackGuide()` - Most comprehensive section
- `guppyGuide()` - Includes external changelog links
- `inertiaSailsGuide()`, `createSailsGuide()`, etc.

Each product has its own sidebar configuration with collapsible sections.

### Site Features

- **Search**: Integrated Orama search plugin and Algolia search
- **Analytics**: TinyLytics integration
- **Social**: Links to GitHub, Twitter, Discord, YouTube
- **Editing**: Direct GitHub edit links for each page
- **Theming**: Custom brand colors and favicon

## Development Guidelines

### Adding New Documentation

1. Create markdown files in appropriate product directory under `docs/`
2. Update the corresponding guide function in `config.mjs` to include new pages
3. Follow existing sidebar structure patterns (Getting started, Basic usage, etc.)

### Configuration Changes

- Site-wide settings in `config.mjs` (title, description, head tags)
- Theme customization in `docs/.vitepress/theme/`
- Navigation updates require modifying the appropriate guide functions

### Content Standards

- Use VitePress markdown features and frontmatter
- Include proper meta descriptions and titles
- Link to external resources (courses, screencasts) where relevant
- Maintain consistent structure across product documentation

### Quality Assurance

- Prettier enforces code formatting (semi: false, singleQuote: true, no trailing commas)
- Husky pre-commit hooks ensure formatting consistency
- Commitlint enforces conventional commit messages

## Project Context

This repository serves as the central documentation hub for The Sailscasts Company's open source ecosystem, primarily focused on Sails.js development tools and enhancements. The documentation supports both free open source projects and commercial products, with clear separation in the navigation structure.
