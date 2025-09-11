# Statistics Tutor App

A comprehensive statistics learning application with AI-powered problem solving, interactive cheatsheet, and quick calculator tools.

![React](https://img.shields.io/badge/React-18.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4)
![Vite](https://img.shields.io/badge/Vite-6.3-646CFF)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

### 📚 Interactive Cheatsheet
- 25+ statistical symbols with detailed explanations
- Searchable and filterable by category
- LaTeX-rendered mathematical formulas
- Favorite symbols for quick access
- Categories: Descriptive, Inference, Probability, Correlation, Regression

### 🤖 AI Problem Solver
- Powered by Grok AI for step-by-step solutions
- Supports all types of statistics problems
- LaTeX-formatted mathematical output
- Problem history tracking
- Example problems for quick start

### 🧮 Quick Calculator
- Calculate mean (average) instantly
- More statistical calculations coming soon
- Clean, intuitive interface

## 🛠️ Tech Stack

- **Frontend:** React 18.3 + Vite
- **Styling:** Tailwind CSS v4 + Catalyst UI
- **Math Rendering:** KaTeX
- **AI Integration:** Grok AI API
- **Testing:** Vitest + React Testing Library
- **Icons:** Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/stats-app.git
cd stats-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Grok API key to `.env`:
```env
VITE_GROK_API_KEY=your_api_key_here
```

Get your API key from [x.ai/api](https://x.ai/api)

## 🚀 Development

Start the development server:
```bash
npm run dev
```

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🌐 Deployment

### Cloudflare Workers

1. Install Wrangler CLI (if not already installed):
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Build and deploy:
```bash
npm run deploy
```

For preview deployment:
```bash
npm run deploy:preview
```

For local Worker development:
```bash
npm run worker:dev
```

### Environment Variables on Cloudflare

Add these environment variables in your Cloudflare Workers dashboard:
- `VITE_GROK_API_KEY` - Your Grok API key
- `VITE_GROK_API_ENDPOINT` - API endpoint (optional, defaults to https://api.x.ai/v1/chat/completions)
- `VITE_GROK_MODEL` - Model name (optional, defaults to grok-4-latest)

## 🧪 Testing

The app includes comprehensive test coverage:
- Unit tests for all page components
- Integration tests for navigation
- Smoke tests for app initialization
- ~95% coverage for main components

Run tests:
```bash
npm test                  # Run all tests
npm run test:unit        # Run unit tests only
npm run test:coverage    # Generate coverage report
```

## 📝 Project Structure

```
stats-app/
├── src/
│   ├── components/       # React components
│   │   ├── catalyst/     # Catalyst UI components
│   │   ├── Layout.jsx    # Main layout with sidebar
│   │   └── SimpleAlert.jsx
│   ├── pages/            # Page components
│   │   ├── HomePage.jsx
│   │   ├── CheatsheetPage.jsx
│   │   └── SolverPage.jsx
│   ├── __tests__/        # Test files
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── app.css           # Global styles
├── public/               # Static assets
├── .env.example          # Environment variables template
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🎨 Features in Detail

### Dark Theme
- Professional dark sidebar navigation
- Responsive mobile menu
- Consistent dark color scheme throughout
- Optimized for readability

### Statistical Symbols Coverage
- Greek letters (μ, σ, α, β, etc.)
- Statistical notations (x̄, s, SE, CI)
- Hypothesis testing symbols (H₀, H₁, p-value)
- Probability notations (P(A), E(X), Var(X))

### Formula Categories
- Descriptive Statistics (mean, median, standard deviation)
- Probability Distributions (normal, binomial, Poisson)
- Hypothesis Testing (t-tests, chi-square, ANOVA)
- Confidence Intervals
- Regression & Correlation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Catalyst UI](https://catalyst-ui.com/)
- Math rendering by [KaTeX](https://katex.org/)
- AI powered by [Grok](https://x.ai/)

---

Built with ❤️ for statistics students everywhere