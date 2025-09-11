import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

describe('Navigation (integration)', () => {
  it('should have correct navigation links', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    // Start at home
    expect(screen.getByText(/Welcome to Statistics Tutor/i)).toBeInTheDocument()
    
    // Check navigation links exist and have correct hrefs
    const cheatsheetLinks = screen.getAllByText(/Cheatsheet/i)
    const navCheatsheetLink = cheatsheetLinks.find(link => link.closest('nav'))
    expect(navCheatsheetLink).toBeTruthy()
    expect(navCheatsheetLink.getAttribute('href')).toBe('/cheatsheet')
    
    const solverLinks = screen.getAllByText(/Problem Solver/i)
    const navSolverLink = solverLinks.find(link => link.closest('nav'))
    expect(navSolverLink).toBeTruthy()
    expect(navSolverLink.getAttribute('href')).toBe('/solver')
  })
})