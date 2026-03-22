import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmergencyPage from './EmergencyPage'
import { renderWithRouter } from '../test-utils'

describe('EmergencyPage', () => {
  test('renders emergency page header', () => {
    renderWithRouter(<EmergencyPage />)

    expect(screen.getByText(/^Emergency Center$/i)).toBeInTheDocument()
    expect(
      screen.getByText(/quick access to emergency contacts and medical information/i)
    ).toBeInTheDocument()
  })

  test('shows emergency action buttons', () => {
    renderWithRouter(<EmergencyPage />)

    expect(
      screen.getByRole('button', { name: /call 911 - emergency/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /^add emergency contact$/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /^contacts$/i })
    ).toBeInTheDocument()
  })

  test('renders initial emergency contacts', () => {
    renderWithRouter(<EmergencyPage />)

    expect(screen.getByText(/sarah doe/i)).toBeInTheDocument()
    expect(screen.getByText(/dr\. emily roberts/i)).toBeInTheDocument()
    expect(screen.getByText(/michael doe/i)).toBeInTheDocument()
  })

  test('filters contacts by search text', async () => {
    const user = userEvent.setup()
    renderWithRouter(<EmergencyPage />)

    const searchInput = screen.getByPlaceholderText(
      /search by name or relationship/i
    )

    await user.type(searchInput, 'spouse')

    expect(screen.getByText(/sarah doe/i)).toBeInTheDocument()
    expect(screen.queryByText(/dr\. emily roberts/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/michael doe/i)).not.toBeInTheDocument()
  })

  test('filters contacts by priority', async () => {
    const user = userEvent.setup()
    renderWithRouter(<EmergencyPage />)

    const filterSelect = screen.getByRole('combobox')
    await user.selectOptions(filterSelect, 'Secondary')

    expect(screen.getByText(/michael doe/i)).toBeInTheDocument()
    expect(screen.queryByText(/sarah doe/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/dr\. emily roberts/i)).not.toBeInTheDocument()
  })

  test('opens add contact modal', async () => {
    const user = userEvent.setup()
    renderWithRouter(<EmergencyPage />)

    await user.click(
      screen.getByRole('button', { name: /^add emergency contact$/i })
    )

    expect(
      screen.getByRole('heading', { name: /^add emergency contact$/i })
    ).toBeInTheDocument()

    expect(screen.getByPlaceholderText(/^Full Name$/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/^Relationship$/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/^Phone Number$/i)).toBeInTheDocument()
  })

  test('adds a new emergency contact', async () => {
    const user = userEvent.setup()
    renderWithRouter(<EmergencyPage />)

    await user.click(
      screen.getByRole('button', { name: /^add emergency contact$/i })
    )

    await user.type(screen.getByPlaceholderText(/^Full Name$/i), 'Jane Doe')
    await user.type(screen.getByPlaceholderText(/^Relationship$/i), 'Sister')
    await user.type(screen.getByPlaceholderText(/^Phone Number$/i), '(555) 777-8888')

    await user.selectOptions(screen.getAllByRole('combobox')[1], 'Secondary')
    await user.click(screen.getByRole('button', { name: /^add contact$/i }))

    expect(screen.getByText(/jane doe/i)).toBeInTheDocument()
    expect(screen.getByText(/sister/i)).toBeInTheDocument()
    expect(screen.getByText(/\(555\) 777-8888/i)).toBeInTheDocument()
  })

  test('switches to medical info tab', async () => {
    const user = userEvent.setup()
    renderWithRouter(<EmergencyPage />)

    await user.click(screen.getByRole('button', { name: /^medical info$/i }))

    expect(
      screen.getByText(/personal medical information/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/medical conditions/i)).toBeInTheDocument()
    expect(screen.getByText(/insurance information/i)).toBeInTheDocument()
  })

  test('switches to protocols tab', async () => {
    const user = userEvent.setup()
    renderWithRouter(<EmergencyPage />)

    await user.click(screen.getByRole('button', { name: /^protocols$/i }))

    expect(screen.getByText(/emergency protocols/i)).toBeInTheDocument()
    expect(screen.getByText(/if you fall/i)).toBeInTheDocument()
    expect(screen.getByText(/medication emergency/i)).toBeInTheDocument()
  })
})