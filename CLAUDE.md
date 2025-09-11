# Statistics Tutor App

## Overview
A comprehensive statistics learning application built with React, Tailwind CSS v4, and Catalyst UI components. Features an interactive cheatsheet and AI-powered problem solver using Grok AI.

## Tech Stack
- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS v4 (no config file needed)
- **UI Components**: Catalyst UI (Headless UI based components)
- **Routing**: React Router v7
- **Math Rendering**: KaTeX for LaTeX formulas
- **AI Integration**: Grok AI API for problem solving
- **Icons**: Lucide React

## Project Structure
```
stats-app/
├── src/
│   ├── components/
│   │   ├── catalyst/     # Catalyst UI components
│   │   └── Layout.jsx    # Main app layout with navigation
│   ├── pages/
│   │   ├── HomePage.jsx      # Landing page with quick calculator
│   │   ├── CheatsheetPage.jsx # Interactive statistics reference
│   │   └── SolverPage.jsx    # AI-powered problem solver
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # React entry point
│   └── app.css           # Tailwind CSS import
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies and scripts
└── CLAUDE.md            # This file
```

## Key Features

### 1. Interactive Cheatsheet (`/cheatsheet`)
- **Searchable Symbol Table**: 25+ statistical symbols with formulas and descriptions
- **Categories**: Descriptive, Inference, Probability, Correlation, Regression
- **Formula Reference**: Organized by topic with explanations and examples
- **Favorites System**: Save frequently used symbols (localStorage)
- **Real-time Search**: Filter symbols and formulas instantly
- **Math Rendering**: Beautiful LaTeX formulas using KaTeX

### 2. AI Problem Solver (`/solver`)
- **Grok AI Integration**: Step-by-step solutions to statistics problems
- **API Key Management**: Secure storage in localStorage
- **Problem History**: Track last 10 solved problems
- **Example Problems**: Pre-filled templates for common scenarios
- **LaTeX Support**: Properly rendered mathematical expressions
- **Error Handling**: Clear feedback for API issues

### 3. Home Page (`/`)
- **Feature Cards**: Quick access to main sections
- **Quick Calculator**: Basic mean calculation tool
- **Modern Design**: Gradient backgrounds and hover effects
- **Responsive Layout**: Works on all screen sizes

## Catalyst UI Components Used
- **Navigation**: Navbar with sections and dividers
- **Forms**: Input, Textarea, Button components
- **Display**: Table, Alert, Heading, Text components
- **Layout**: Responsive grid and flex utilities

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   App will open at http://localhost:5173

3. **Build for Production**:
   ```bash
   npm run build
   ```

## API Configuration

### Grok AI Setup

#### Option 1: Environment Variables (Recommended)
1. Get API key from https://x.ai/api
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Add your API key to `.env`:
   ```
   VITE_GROK_API_KEY=your_actual_api_key_here
   ```
4. Restart the development server

#### Option 2: Browser Storage (Fallback)
1. Get API key from https://x.ai/api
2. Enter key when prompted in the Problem Solver
3. Key is stored in browser localStorage

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_GROK_API_KEY` | Your Grok API key | None (prompts user) |
| `VITE_GROK_API_ENDPOINT` | API endpoint URL | `https://api.x.ai/v1/chat/completions` |
| `VITE_GROK_MODEL` | Model to use | `grok-4-latest` |

## Data Storage
- **API Key**: localStorage key `grok-api-key`
- **Problem History**: localStorage key `problem-history`
- **Favorite Symbols**: localStorage key `stats-favorites`

## Styling Guidelines
- Uses Tailwind CSS v4 (no config file needed)
- Dark mode support with `dark:` prefixes
- Consistent color scheme: slate for neutrals, blue/green for actions
- Rounded corners (`rounded-lg`) for cards
- Subtle shadows and borders for depth

## Component Patterns
- **Catalyst UI**: All UI components from `src/components/catalyst/`
- **Icons**: Lucide React for consistent iconography
- **Math Rendering**: `react-katex` for inline and block math
- **Routing**: React Router with nested routes

## Future Enhancements
- [ ] Add more statistical distributions and tests
- [ ] Implement data visualization with charts
- [ ] Add CSV data import for calculations
- [ ] Include practice problems with solutions
- [ ] Add offline mode with service workers
- [ ] Implement user accounts for saving work
- [ ] Add export to PDF functionality
- [ ] Include statistical tables (z, t, chi-square)

## Browser Compatibility
- Modern browsers with ES6+ support
- localStorage required for persistence
- Internet connection needed for AI solver

## Performance Considerations
- Lazy loading for route components
- Memoized search filtering
- Debounced API calls
- Efficient re-renders with React hooks

## Security Notes
- API keys stored in localStorage (client-side only)
- No sensitive data transmitted to external services
- HTTPS recommended for production deployment

## Testing Strategy

### Test-Driven Development (TDD) Approach
Following TDD methodology with the Red-Green-Refactor cycle:
1. **Red**: Write a failing test for new functionality
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve code while keeping tests green

### Testing Setup

1. **Install Testing Dependencies**:
   ```bash
   npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
   ```

2. **Configure Vitest** (`vite.config.js`):
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     test: {
       globals: true,
       environment: 'jsdom',
       setupFiles: './src/test/setup.js',
       coverage: {
         reporter: ['text', 'json', 'html']
       }
     }
   })
   ```

3. **Create Test Setup** (`src/test/setup.js`):
   ```javascript
   import '@testing-library/jest-dom'
   import { cleanup } from '@testing-library/react'
   import { afterEach } from 'vitest'

   afterEach(() => {
     cleanup()
   })
   ```

4. **Update package.json scripts**:
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:ui": "vitest --ui",
       "test:coverage": "vitest run --coverage",
       "test:smoke": "vitest run --grep smoke",
       "test:unit": "vitest run --grep unit"
     }
   }
   ```

### Unit Tests

#### HomePage Component Tests (`src/pages/__tests__/HomePage.test.jsx`)
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import HomePage from '../HomePage'

describe('HomePage (unit)', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render welcome message', () => {
    renderComponent()
    expect(screen.getByText(/Welcome to Statistics Tutor/i)).toBeInTheDocument()
  })

  it('should calculate mean correctly', async () => {
    renderComponent()
    const input = screen.getByPlaceholderText(/Enter numbers separated by commas/i)
    const button = screen.getByText(/Calculate/i)
    
    fireEvent.change(input, { target: { value: '2,4,6,8,10' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/Mean: 6.00/i)).toBeInTheDocument()
    })
  })

  it('should handle invalid input gracefully', async () => {
    renderComponent()
    const input = screen.getByPlaceholderText(/Enter numbers separated by commas/i)
    const button = screen.getByText(/Calculate/i)
    
    fireEvent.change(input, { target: { value: 'abc,def' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter valid numbers/i)).toBeInTheDocument()
    })
  })

  it('should navigate to cheatsheet on button click', () => {
    renderComponent()
    const cheatsheetButton = screen.getByRole('link', { name: /Browse Cheatsheet/i })
    expect(cheatsheetButton).toHaveAttribute('href', '/cheatsheet')
  })

  it('should navigate to solver on button click', () => {
    renderComponent()
    const solverButton = screen.getByRole('link', { name: /Solve Problems/i })
    expect(solverButton).toHaveAttribute('href', '/solver')
  })
})
```

#### CheatsheetPage Component Tests (`src/pages/__tests__/CheatsheetPage.test.jsx`)
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CheatsheetPage from '../CheatsheetPage'

describe('CheatsheetPage (unit)', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CheatsheetPage />
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should render statistics symbols table', () => {
    renderComponent()
    expect(screen.getByText(/Statistics Cheatsheet/i)).toBeInTheDocument()
    expect(screen.getByText(/Mu \(Population Mean\)/i)).toBeInTheDocument()
  })

  it('should filter symbols based on search input', async () => {
    renderComponent()
    const searchInput = screen.getByPlaceholderText(/Search symbols/i)
    
    fireEvent.change(searchInput, { target: { value: 'sigma' } })
    
    await waitFor(() => {
      expect(screen.getByText(/Sigma \(Population Std Dev\)/i)).toBeInTheDocument()
      expect(screen.queryByText(/Mu \(Population Mean\)/i)).not.toBeInTheDocument()
    })
  })

  it('should filter by category', async () => {
    renderComponent()
    const inferenceButton = screen.getByRole('button', { name: /Inference/i })
    
    fireEvent.click(inferenceButton)
    
    await waitFor(() => {
      expect(screen.getByText(/p-value/i)).toBeInTheDocument()
      expect(screen.queryByText(/Correlation Coefficient/i)).not.toBeInTheDocument()
    })
  })

  it('should toggle favorites and persist in localStorage', () => {
    renderComponent()
    const favoriteButtons = screen.getAllByRole('button')[0]
    
    fireEvent.click(favoriteButtons)
    
    const saved = JSON.parse(localStorage.getItem('stats-favorites') || '[]')
    expect(saved.length).toBeGreaterThan(0)
  })

  it('should expand and collapse formula sections', () => {
    renderComponent()
    const sectionButton = screen.getByText(/Descriptive Statistics/i)
    
    fireEvent.click(sectionButton)
    
    expect(screen.getByText(/Sum all values and divide by count/i)).toBeInTheDocument()
  })
})
```

#### SolverPage Component Tests (`src/pages/__tests__/SolverPage.test.jsx`)
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SolverPage from '../SolverPage'

// Mock fetch API
global.fetch = vi.fn()

describe('SolverPage (unit)', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <SolverPage />
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    fetch.mockClear()
  })

  it('should render problem input area', () => {
    renderComponent()
    expect(screen.getByText(/AI Problem Solver/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Example: Calculate/i)).toBeInTheDocument()
  })

  it('should show API key dialog if no key is saved', () => {
    renderComponent()
    expect(screen.getByText(/API Key Required/i)).toBeInTheDocument()
  })

  it('should save API key to localStorage', async () => {
    renderComponent()
    const input = screen.getByPlaceholderText(/Enter your Grok API key/i)
    const saveButton = screen.getByText(/Save Key/i)
    
    fireEvent.change(input, { target: { value: 'test-api-key' } })
    fireEvent.click(saveButton)
    
    expect(localStorage.getItem('grok-api-key')).toBe('test-api-key')
  })

  it('should handle API call successfully', async () => {
    localStorage.setItem('grok-api-key', 'test-key')
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: 'Solution: The mean is 5'
          }
        }]
      })
    })
    
    renderComponent()
    const textarea = screen.getByPlaceholderText(/Example: Calculate/i)
    const solveButton = screen.getByRole('button', { name: /Solve Problem/i })
    
    fireEvent.change(textarea, { target: { value: 'Calculate mean of 2,4,6,8' } })
    fireEvent.click(solveButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Solution: The mean is 5/i)).toBeInTheDocument()
    })
  })

  it('should display error on API failure', async () => {
    localStorage.setItem('grok-api-key', 'test-key')
    
    fetch.mockRejectedValueOnce(new Error('API Error'))
    
    renderComponent()
    const textarea = screen.getByPlaceholderText(/Example: Calculate/i)
    const solveButton = screen.getByRole('button', { name: /Solve Problem/i })
    
    fireEvent.change(textarea, { target: { value: 'Test problem' } })
    fireEvent.click(solveButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to solve problem/i)).toBeInTheDocument()
    })
  })

  it('should load example problems', () => {
    renderComponent()
    const exampleProblem = screen.getByText(/Confidence Interval Calculation/i)
    
    fireEvent.click(exampleProblem)
    
    const textarea = screen.getByPlaceholderText(/Example: Calculate/i)
    expect(textarea.value).toContain('confidence interval')
  })

  it('should save problem history to localStorage', async () => {
    localStorage.setItem('grok-api-key', 'test-key')
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: 'Solution'
          }
        }]
      })
    })
    
    renderComponent()
    const textarea = screen.getByPlaceholderText(/Example: Calculate/i)
    const solveButton = screen.getByRole('button', { name: /Solve Problem/i })
    
    fireEvent.change(textarea, { target: { value: 'Test problem' } })
    fireEvent.click(solveButton)
    
    await waitFor(() => {
      const history = JSON.parse(localStorage.getItem('problem-history') || '[]')
      expect(history[0].problem).toBe('Test problem')
    })
  })
})
```

### Smoke Tests

#### App Smoke Tests (`src/__tests__/App.smoke.test.jsx`)
```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

describe('App (smoke)', () => {
  it('should render without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    expect(screen.getByText(/Stats Tutor/i)).toBeInTheDocument()
  })

  it('should have navigation links', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    expect(screen.getByText(/Home/i)).toBeInTheDocument()
    expect(screen.getByText(/Cheatsheet/i)).toBeInTheDocument()
    expect(screen.getByText(/Problem Solver/i)).toBeInTheDocument()
  })
})
```

### Integration Tests

#### Navigation Integration Test (`src/__tests__/Navigation.integration.test.jsx`)
```javascript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

describe('Navigation (integration)', () => {
  it('should navigate between pages', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    // Start at home
    expect(screen.getByText(/Welcome to Statistics Tutor/i)).toBeInTheDocument()
    
    // Navigate to cheatsheet
    const cheatsheetLink = screen.getByRole('link', { name: /Cheatsheet/i })
    fireEvent.click(cheatsheetLink)
    
    await waitFor(() => {
      expect(screen.getByText(/Statistics Cheatsheet/i)).toBeInTheDocument()
    })
    
    // Navigate to solver
    const solverLink = screen.getByRole('link', { name: /Problem Solver/i })
    fireEvent.click(solverLink)
    
    await waitFor(() => {
      expect(screen.getByText(/AI Problem Solver/i)).toBeInTheDocument()
    })
  })
})
```

### Testing Utils

#### Test Utilities (`src/test/utils.js`)
```javascript
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

export const renderWithRouter = (component, options = {}) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>,
    options
  )
}

export const mockLocalStorage = () => {
  const store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    removeItem: (key) => { delete store[key] },
    clear: () => { Object.keys(store).forEach(key => delete store[key]) }
  }
}

export const createMockApiResponse = (data) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data)
  })
}
```

### Running Tests

1. **Run all tests**:
   ```bash
   npm test
   ```

2. **Run tests with UI**:
   ```bash
   npm run test:ui
   ```

3. **Run unit tests only**:
   ```bash
   npm run test:unit
   ```

4. **Run smoke tests only**:
   ```bash
   npm run test:smoke
   ```

5. **Generate coverage report**:
   ```bash
   npm run test:coverage
   ```

### Test Coverage Goals
- **Unit Tests**: 80% coverage for all components
- **Integration Tests**: Critical user paths covered
- **Smoke Tests**: All pages render without errors
- **E2E Tests**: Main workflows (search, solve, navigate)

### TDD Workflow Example

When adding a new feature (e.g., "Export to PDF"):

1. **Write failing test**:
   ```javascript
   it('should export cheatsheet to PDF', async () => {
     renderComponent()
     const exportButton = screen.getByText(/Export to PDF/i)
     fireEvent.click(exportButton)
     expect(mockDownload).toHaveBeenCalledWith('statistics-cheatsheet.pdf')
   })
   ```

2. **Implement minimal code** to make test pass

3. **Refactor** for better code quality

4. **Add edge cases** and error handling tests

5. **Run full test suite** to ensure no regression

### CI/CD Integration

Add to `.github/workflows/test.yml`:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```