import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  test('renders app without crashing', () => {
    render(<App />)

    // Basic sanity check: something renders
    expect(document.body).toBeInTheDocument()
  })

  test('renders landing page content on default route', () => {
    render(<App />)

    // Assert key visible elements (more reliable than "some match")
    expect(
      screen.getByRole('heading', { name: /healthcare management/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: /designed for you/i })
    ).toBeInTheDocument()

    expect(
      screen.getAllByText(/careconnect/i).length
    ).toBeGreaterThan(0)

    expect(
      screen.getAllByRole('link', { name: /sign in/i }).length
    ).toBeGreaterThan(0)

    expect(
      screen.getAllByRole('link', { name: /get started/i }).length
    ).toBeGreaterThan(0)
  })
})