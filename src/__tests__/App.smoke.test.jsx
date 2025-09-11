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
    // There are multiple "Stats Tutor" texts (mobile and desktop sidebars)
    const statsTutorElements = screen.getAllByText(/Stats Tutor/i)
    expect(statsTutorElements.length).toBeGreaterThan(0)
  })

  it('should have navigation links', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    // Check for navigation links specifically
    const navElements = screen.getAllByRole('navigation')
    expect(navElements.length).toBeGreaterThan(0)
    
    // Check for links in navigation
    const homeLinks = screen.getAllByText(/Home/i)
    const cheatsheetLinks = screen.getAllByText(/Cheatsheet/i)
    const solverLinks = screen.getAllByText(/Problem Solver/i)
    
    expect(homeLinks.length).toBeGreaterThan(0)
    expect(cheatsheetLinks.length).toBeGreaterThan(0)
    expect(solverLinks.length).toBeGreaterThan(0)
  })
})