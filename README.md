# Lumen Insights Pte Ltd

Corporate website for **Lumen Insights Pte Ltd**, a Singapore-based boutique finance and business technology advisory firm offering accounting, bookkeeping, tax, corporate secretarial, and digital solutions services.

## Pages

| File | Description |
|------|-------------|
| `index.html` | Home page with hero video, services overview, and CTA |
| `about.html` | Company background, founder profile, and certifications |
| `services.html` | Detailed service offerings |
| `blog.html` | Blog / insights listing |
| `contact.html` | Contact form and business details |

## Tech Stack

- **Pure HTML / CSS / JS** — no frameworks, no build tools, no package manager
- Semantic HTML5 with responsive design
- Custom CSS with CSS variables
- Vanilla JavaScript for mobile nav toggle and contact form handling

## Project Structure

```
├── index.html
├── about.html
├── services.html
├── blog.html
├── contact.html
├── styles.css          # Shared stylesheet
├── script.js           # Shared behavior (nav toggle, contact form)
└── Assets/
    ├── About/          # About page images
    ├── Home/           # Home page images and video
    ├── Logo/           # Company logo
    ├── Services/       # Services page images
    ├── fonts/          # Self-hosted web fonts (.woff2)
    ├── icons/          # Social media icons
    └── images/         # Shared images (blog, OG image, etc.)
```

## Local Development

No build step required. Open any `.html` file in a browser, or serve locally:

```bash
# Python
python -m http.server 8000

# Node.js (if npx available)
npx serve .
```

Then visit `http://localhost:8000`.

## License

All rights reserved. &copy; Lumen Insights Pte Ltd.
