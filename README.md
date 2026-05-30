# Lessons in SignWriting

A faithful, interactive web rebuild of *Lessons in SignWriting* by Valerie
Sutton, with live SignWriting, interactive viewers, and example signs.

**Live site: <https://research.sign.mt/lessons-in-signwriting/>**

Source: the 2014 fourth-edition PDF distributed at
[signwriting.org](https://www.signwriting.org/archive/docs2/sw0116-Lessons-SignWriting.pdf).

## Development

```bash
bun install
bun run dev      # http://localhost:5173/
bun run build    # type-check + production build to dist/
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
`VITE_BASE=/lessons-in-signwriting/` and publishes `dist/` to GitHub Pages.

## License

Content and code are released under
[CC BY 4.0](./LICENSE). SignWriting is written with the Sutton SignWriting
fonts and web components by Stephen E. Slevinski, Jr.
