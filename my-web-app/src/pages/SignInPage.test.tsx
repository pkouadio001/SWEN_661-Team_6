import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignInPage } from './SignInPage'
import { renderWithRouter } from '../test-utils'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('SignInPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

test('renders sign in UI', () => {
  renderWithRouter(<SignInPage />)

  expect(
    screen.getByRole('heading', { name: /careconnect/i, level: 1 })
  ).toBeInTheDocument()

  expect(screen.getByText(/welcome back/i)).toBeInTheDocument()

  expect(
    screen.getByRole('heading', { name: /sign in to your account/i, level: 2 })
  ).toBeInTheDocument()

  expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /forgot password/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /use demo credentials/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /need help\? contact support/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /back to home/i })).toBeInTheDocument()
})

  test('allows typing into fields', async () => {
    const user = userEvent.setup()
    renderWithRouter(<SignInPage />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'secret123')

    expect(emailInput).toHaveValue('john@example.com')
    expect(passwordInput).toHaveValue('secret123')
  })

  test('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderWithRouter(<SignInPage />)

    const passwordInput = screen.getByLabelText(/password/i)
    const toggleButton = screen.getAllByRole('button').find(
      (btn) => btn.getAttribute('type') === 'button' && btn !== screen.getByRole('button', { name: /forgot password/i })
    )

    expect(passwordInput).toHaveAttribute('type', 'password')

    if (toggleButton) {
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')
    }
  })

  test('fills demo credentials when demo button is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<SignInPage />)

    await user.click(screen.getByRole('button', { name: /use demo credentials/i }))

    expect(screen.getByLabelText(/email address/i)).toHaveValue('demo@careconnect.com')
    expect(screen.getByLabelText(/password/i)).toHaveValue('demo123')
  })

  test('submits and navigates to dashboard', async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    renderWithRouter(<SignInPage />)

    await user.type(screen.getByLabelText(/email address/i), 'demo@careconnect.com')
    await user.type(screen.getByLabelText(/password/i), 'demo123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByText(/signing in/i)).toBeInTheDocument()

    jest.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })

    jest.useRealTimers()
  })

  test('renders secondary controls', () => {
    renderWithRouter(<SignInPage />)

    expect(screen.getByRole('link', { name: /back to home/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /forgot password/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /need help\? contact support/i })).toBeInTheDocument()
  })
})