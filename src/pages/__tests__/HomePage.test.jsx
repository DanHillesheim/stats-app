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
    const input = screen.getByPlaceholderText(/e\.g\., 1, 2, 3, 4, 5/i)
    const button = screen.getByRole('button', { name: /Calculate/i })
    
    fireEvent.change(input, { target: { value: '2,4,6,8,10' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/Mean: 6.00/i)).toBeInTheDocument()
    })
  })

  it('should handle invalid input gracefully', async () => {
    renderComponent()
    const input = screen.getByPlaceholderText(/e\.g\., 1, 2, 3, 4, 5/i)
    const button = screen.getByRole('button', { name: /Calculate/i })
    
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