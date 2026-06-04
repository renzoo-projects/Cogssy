# Cogssy 🧮

Cogssy helps you figure out how much your products actually cost to make and
what you should sell them for. Stop guessing, start pricing. 🎯

## Tech ⚙️

Next.js 16, React 19, TypeScript, Tailwind v4, @base-ui/react, localStorage.

## Quick Start 🚀

```bash
git clone <url>
cd cogssy
npm install
npm run dev
```

## Features ✨

- **Unit conversion** 🔄 — buy by the kg, use by the gram
- **Overhead presets** 📋 — 8 common overheads included
- **Margin slider** 🎚️ — set your target margin, get the price
- **Live costing** ⚡ — costs update as you tweak ingredients

## Usage 📖

**1. Add ingredients** — flour, butter, sugar, whatever you buy to make your
products. Set the purchase unit (kg, L, piece) and what you paid.

**2. Set up overheads** — labor, packaging, rent. 8 common presets are ready
to go; add your own as needed.

**3. Create a product** — pick ingredients, enter how much goes into each
product, assign overhead costs. The target price updates as you go.

**4. Adjust margin** — move the slider or type a number. See profit and
gross margin change in real time.

## Routes 🗺️

| Path | Page |
|---|---|
| `/` | Dashboard 🏠 |
| `/ingredients` | Ingredients 🥘 |
| `/overheads` | Overheads 🧾 |
| `/categories` | Categories 📁 |
| `/products` | Products 📦 |
| `/products/[id]` | Product detail 🔍 |
