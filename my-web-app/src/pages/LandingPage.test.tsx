import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LandingPage } from './LandingPage'
import { renderWithRouter } from '../test-utils'

describe('LandingPage', () => {
  test('renders hero content and primary actions', () => {
    renderWithRouter(<LandingPage />)

    expect(
      screen.getByRole('heading', { name: /healthcare management/i, level: 1 })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: /designed for you/i, level: 2 })
    ).toBeInTheDocument()

    expect(screen.getAllByText(/careconnect/i).length).toBeGreaterThan(0)

    expect(
      screen.getAllByRole('link', { name: /sign in/i }).length
    ).toBeGreaterThan(0)

    expect(
      screen.getAllByRole('link', { name: /get started/i }).length
    ).toBeGreaterThan(0)
  })

  test('renders accessibility section content', () => {
    renderWithRouter(<LandingPage />)

    expect(
      screen.getByRole('heading', { name: /accessibility first/i, level: 2 })
    ).toBeInTheDocument()

    expect(
      screen.getByText('Extra-large buttons (96-112px) for easy tapping')
    ).toBeInTheDocument()

    expect(
      screen.getByText('High-contrast colors for better visibility')
    ).toBeInTheDocument()

    expect(
      screen.getByText("Large text (20px+) that's easy to read")
    ).toBeInTheDocument()

    expect(
      screen.getByText('Generous spacing between all elements')
    ).toBeInTheDocument()

    expect(
      screen.getAllByText('One-tap emergency calling').length
    ).toBeGreaterThan(0)

    expect(
      screen.getByText('Designed specifically for motor difficulties')
    ).toBeInTheDocument()
  })

  test('renders feature cards', () => {
    renderWithRouter(<LandingPage />)

    expect(screen.getByText(/medication management/i)).toBeInTheDocument()
    expect(screen.getByText(/appointment scheduling/i)).toBeInTheDocument()
    expect(screen.getByText(/health tracking/i)).toBeInTheDocument()
    expect(screen.getByText(/emergency access/i)).toBeInTheDocument()
    expect(screen.getByText(/caretaker communication/i)).toBeInTheDocument()
    expect(screen.getByText(/designed for accessibility/i)).toBeInTheDocument()
  })

  test('navigation links are clickable', async () => {
    const user = userEvent.setup()
    renderWithRouter(<LandingPage />)

    await user.click(screen.getAllByRole('link', { name: /sign in/i })[0])
    await user.click(screen.getAllByRole('link', { name: /get started/i })[0])
  })
})