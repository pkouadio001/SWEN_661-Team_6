import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AccountSettingsPage from './AccountSettingsPage'
import { renderWithRouter } from '../test-utils'

describe('AccountSettingsPage', () => {
  test('renders header and default profile tab', () => {
    renderWithRouter(<AccountSettingsPage />)

    expect(screen.getByText(/^CareConnect$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Account Settings$/i)).toBeInTheDocument()
    expect(screen.getByText(/personal information/i)).toBeInTheDocument()
    expect(screen.getByText(/emergency contact/i)).toBeInTheDocument()
  })

  test('renders navigation buttons', () => {
    renderWithRouter(<AccountSettingsPage />)

    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  test('switches to medications tab', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AccountSettingsPage />)

    await user.click(screen.getByRole('button', { name: /^medications$/i }))

    expect(screen.getByText(/my medications/i)).toBeInTheDocument()
    expect(screen.getByText(/levodopa/i)).toBeInTheDocument()
    expect(screen.getByText(/vitamin d/i)).toBeInTheDocument()
  })

  test('switches to appointments tab', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AccountSettingsPage />)

    await user.click(screen.getByRole('button', { name: /^appointments$/i }))

    expect(screen.getByText(/upcoming appointments/i)).toBeInTheDocument()
    expect(screen.getByText(/physical therapy/i)).toBeInTheDocument()
    expect(screen.getByText(/neurologist check-up/i)).toBeInTheDocument()
  })

  test('switches to settings tab', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AccountSettingsPage />)

    await user.click(screen.getByRole('button', { name: /^settings$/i }))

    expect(screen.getByText(/app settings/i)).toBeInTheDocument()
    expect(screen.getByText(/^Text Size/i)).toBeInTheDocument()
    expect(screen.getAllByText(/notifications/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/^Language/i)).toBeInTheDocument()
  })

  test('opens edit profile modal', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AccountSettingsPage />)

    await user.click(screen.getByRole('button', { name: /edit profile/i }))

    expect(screen.getByRole('heading', { name: /edit profile/i })).toBeInTheDocument()
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('demo@careconnect.com')).toBeInTheDocument()
  })

  test('updates profile information', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AccountSettingsPage />)

    await user.click(screen.getByRole('button', { name: /edit profile/i }))

    const fullNameInput = screen.getByDisplayValue('John Doe')
    await user.clear(fullNameInput)
    await user.type(fullNameInput, 'Jane Doe')

    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })

  test('opens add medication modal', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AccountSettingsPage />)

    await user.click(screen.getByRole('button', { name: /^medications$/i }))
    await user.click(screen.getByRole('button', { name: /^add medication$/i }))

    expect(screen.getByRole('heading', { name: /^add medication$/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/^Medication Name$/i)).toBeInTheDocument()
  })

  test('adds a medication', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AccountSettingsPage />)

    await user.click(screen.getByRole('button', { name: /^medications$/i }))
    await user.click(screen.getByRole('button', { name: /^add medication$/i }))

    await user.type(screen.getByPlaceholderText(/^Medication Name$/i), 'Ibuprofen')
    await user.type(screen.getByPlaceholderText(/^Dosage \(e\.g\. 100mg\)$/i), '200mg')
    await user.type(screen.getByPlaceholderText(/^Frequency \(e\.g\. Once daily\)$/i), 'Twice daily')
    await user.type(screen.getByPlaceholderText(/^Times \(e\.g\. 8:00 AM, 2:00 PM\)$/i), '8:00 AM, 8:00 PM')

    const addButtons = screen.getAllByRole('button', { name: /^add medication$/i })
    await user.click(addButtons[1])

    expect(screen.getByText(/ibuprofen/i)).toBeInTheDocument()
    expect(screen.getByText(/200mg/i)).toBeInTheDocument()
  })

  test('deletes a medication', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AccountSettingsPage />)

    await user.click(screen.getByRole('button', { name: /^medications$/i }))

    expect(screen.getByText(/levodopa/i)).toBeInTheDocument()

    const buttons = screen.getAllByRole('button')
    await user.click(buttons[5])

    expect(screen.queryByText(/levodopa/i)).not.toBeInTheDocument()
  })

  test('saves settings', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AccountSettingsPage />)

    await user.click(screen.getByRole('button', { name: /^settings$/i }))
    await user.click(screen.getByRole('button', { name: /save settings/i }))

    expect(screen.getByRole('button', { name: /settings saved!/i })).toBeInTheDocument()
  })
})