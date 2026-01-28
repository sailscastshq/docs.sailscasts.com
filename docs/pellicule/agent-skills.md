# Agent Skills

Pellicule maintains a list of Agent Skills: Guidelines that AI agents can use to learn how to work within Pellicule projects.

These are useful for AI agents like [Claude Code](https://claude.ai/claude-code), [Cursor](https://cursor.sh/), or [GitHub Copilot](https://github.com/features/copilot).

## Installation

You can install the skills using the following command:

```bash
npx skills add sailscastshq/pellicule-skills
```

## What's Included

The skills package includes comprehensive documentation for:

- **getting-started** - Installation, basic setup, and core concepts
- **macros** - `defineVideoConfig` compiler macro for zero-config rendering
- **animations** - Animation utilities: `interpolate`, `sequence`, and easing functions
- **composables** - Vue composables: `useFrame`, `useVideoConfig`, `useSequence`
- **sequences** - `Sequence` component and `useSequence` for scene management
- **patterns** - Common animation patterns (typewriter, staggered, scenes, loops)
- **rendering** - CLI options and video output configuration
- **styling** - CSS, fonts, colors, and visual design

## Usage

After installing, simply ask your AI assistant to create a video:

> "Create a 5-second intro video for my app called 'Notify' with a bell icon that bounces in"

The AI will:

1. Write a Vue component with proper Pellicule animations
2. Render it to MP4 using `npx pellicule`

## Source

The skills are maintained at [sailscastshq/pellicule-skills](https://github.com/sailscastshq/pellicule-skills) on GitHub.
