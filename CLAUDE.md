# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for **Lumen Insights Pte Ltd**, a Singapore-based accounting and bookkeeping consultancy. This repo contains a clean, lightweight set of hand-authored HTML/CSS/JS pages (originally sourced from a Wix export, now refactored to remove Wix runtime code).

## Architecture

- **No build system, no package manager, no tests** — this is a collection of static HTML files served directly.
- Pages: `index.html`, `about.html`, `services.html`, `blog.html`, `contact.html`
- Shared styling: `styles.css`
- Shared behavior: `script.js` (mobile nav toggle + contact form mailto fallback)
- Static assets live under `Assets/` organized by purpose (`Assets/Home/`, `Assets/About/`, `Assets/Services/`, `Assets/images/`, `Assets/icons/`, `Assets/fonts/`).

## Key Considerations

- Keep pages semantic and lightweight; avoid reintroducing third-party runtimes unless necessary.
- Ensure asset references stay local (except intentional outbound links like the legacy Wix blog link).
- If updating shared header/footer markup, apply changes consistently across all pages.
