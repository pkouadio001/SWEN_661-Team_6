import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardPage from './DashboardPage'
import { renderWithRouter } from '../test-utils'

describe('DashboardPage', () => {
  test('renders header content and main sections', () => {
    renderWithRouter(<DashboardPage />)

    expect(screen.getByText(/careconnect/i)).toBeInTheDocument()
    expect(screen.getByText(/welcome,\s*john doe/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /account/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: /quick actions/i, level: 2 })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: /today's schedule/i, level: 2 })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: /emergency contacts/i, level: 2 })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: /health summary/i, level: 2 })
    ).toBeInTheDocument()
  })

  test('renders quick action buttons', () => {
    renderWithRouter(<DashboardPage />)

    expect(
      screen.getByRole('button', { name: /medications track your daily doses/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /appointments view upcoming visits/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /health log log symptoms and mood/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /caretaker notes messages from your care team/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /emergency quick access to emergency help/i })
    ).toBeInTheDocument()
  })

  test('renders emergency action buttons', () => {
    renderWithRouter(<DashboardPage />)

    expect(screen.getByRole('button', { name: /^read message$/i })).toBeInTheDocument()

    expect(screen.getAllByRole('button', { name: /^call$/i })).toHaveLength(2)
  })

  test('buttons are clickable', async () => {
    const user = userEvent.setup()
    renderWithRouter(<DashboardPage />)

    await user.click(screen.getByRole('button', { name: /account/i }))
    await user.click(screen.getByRole('button', { name: /sign out/i }))
    await user.click(
      screen.getByRole('button', { name: /medications track your daily doses/i })
    )
  })
})