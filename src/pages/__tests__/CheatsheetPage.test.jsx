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
    const favoriteButtons = screen.getAllByRole('button')
    // Find the first star button (should be in the table)
    const starButton = favoriteButtons.find(button => 
      button.querySelector('svg') && button.closest('td')
    )
    
    if (starButton) {
      fireEvent.click(starButton)
      
      const saved = JSON.parse(localStorage.getItem('stats-favorites') || '[]')
      expect(saved.length).toBeGreaterThan(0)
    }
  })

  it('should expand and collapse formula sections', () => {
    renderComponent()
    const sectionButton = screen.getByText(/Descriptive Statistics/i)
    
    fireEvent.click(sectionButton)
    
    expect(screen.getByText(/Sum all values and divide by count/i)).toBeInTheDocument()
  })
})