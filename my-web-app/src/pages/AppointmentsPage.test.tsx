import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppointmentsPage } from './AppointmentsPage'
import { renderWithRouter } from '../test-utils'

describe('AppointmentsPage', () => {
  test('renders page heading and subtitle', () => {
    renderWithRouter(<AppointmentsPage />)

    expect(screen.getByText(/my appointments/i)).toBeInTheDocument()
    expect(screen.getByText(/manage your healthcare schedule/i)).toBeInTheDocument()
  })

  test('renders initial appointments', () => {
    renderWithRouter(<AppointmentsPage />)

    expect(screen.getByText(/general checkup/i)).toBeInTheDocument()
    expect(screen.getByText(/physical therapy session/i)).toBeInTheDocument()
    expect(screen.getByText(/neurologist follow-up/i)).toBeInTheDocument()
  })

  test('filters appointments by search text', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AppointmentsPage />)

    const searchInput = screen.getByPlaceholderText(
      /search by doctor, specialty, or title/i
    )

    await user.type(searchInput, 'neurologist')

    expect(screen.getByText(/neurologist follow-up/i)).toBeInTheDocument()
    expect(screen.queryByText(/general checkup/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/physical therapy session/i)).not.toBeInTheDocument()
  })

  test('filters appointments by status', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AppointmentsPage />)

    const [filterSelect] = screen.getAllByRole('combobox')
    await user.selectOptions(filterSelect, 'Past')

    expect(screen.getByText(/general checkup/i)).toBeInTheDocument()
    expect(screen.queryByText(/physical therapy session/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/neurologist follow-up/i)).not.toBeInTheDocument()
  })

  test('opens add appointment modal', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AppointmentsPage />)

    await user.click(screen.getByRole('button', { name: /add appointment/i }))

    expect(screen.getAllByText(/add appointment/i).length).toBeGreaterThan(1)
    expect(screen.getByPlaceholderText(/^Appointment Title$/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/^Doctor Name$/i)).toBeInTheDocument()
  })

  test('adds a new appointment', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AppointmentsPage />)

    await user.click(screen.getByRole('button', { name: /add appointment/i }))

    await user.type(
      screen.getByPlaceholderText(/^Appointment Title$/i),
      'Dental Cleaning'
    )
    await user.type(
      screen.getByPlaceholderText(/^Doctor Name$/i),
      'Dr. Smith'
    )
    await user.type(
      screen.getByPlaceholderText(/^Specialty$/i),
      'Dentistry'
    )
    await user.type(
      screen.getByPlaceholderText(/^Date \(e\.g\. Mar 17, 2026\)$/i),
      'Apr 10, 2026'
    )
    await user.type(
      screen.getByPlaceholderText(/^Time \(e\.g\. 10:00 AM\)$/i),
      '11:00 AM'
    )
    await user.type(
      screen.getByPlaceholderText(/^Location$/i),
      'Dental Clinic'
    )
    await user.type(
      screen.getByPlaceholderText(/^Address$/i),
      '100 Main St'
    )
    await user.type(
      screen.getByPlaceholderText(/^Notes$/i),
      'Bring insurance card'
    )

    const addButtons = screen.getAllByRole('button', { name: /add appointment/i })
    await user.click(addButtons[1])

    expect(screen.getByText(/dental cleaning/i)).toBeInTheDocument()
    expect(screen.getByText(/dr\. smith/i)).toBeInTheDocument()
  })

  test('deletes an appointment when cancel is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AppointmentsPage />)

    expect(screen.getByText(/general checkup/i)).toBeInTheDocument()

    const cancelButtons = screen.getAllByRole('button', { name: /cancel/i })
    await user.click(cancelButtons[0])

    expect(screen.queryByText(/general checkup/i)).not.toBeInTheDocument()
  })
})