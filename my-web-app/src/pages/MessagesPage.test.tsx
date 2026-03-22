import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MessagesPage } from './MessagesPage'
import { renderWithRouter } from '../test-utils'

describe('MessagesPage', () => {
  test('renders messages page header', () => {
    renderWithRouter(<MessagesPage />)

    expect(screen.getByRole('heading', { name: /caretaker messages/i })).toBeInTheDocument()
    expect(screen.getByText(/communicate with your care team/i)).toBeInTheDocument()
  })

  test('renders search, filter, and compose controls', () => {
    renderWithRouter(<MessagesPage />)

    expect(screen.getByPlaceholderText(/search by sender, subject, or content/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /compose message/i })).toBeInTheDocument()
  })

  test('renders message cards', () => {
    renderWithRouter(<MessagesPage />)

    expect(screen.getByText(/medication adjustment needed/i)).toBeInTheDocument()
    expect(screen.getByText(/appointment reminder/i)).toBeInTheDocument()
    expect(screen.getByText(/dr\. sarah johnson/i)).toBeInTheDocument()
    expect(screen.getByText(/mary doe \(caregiver\)/i)).toBeInTheDocument()
  })

test('renders urgent and received badges', () => {
  renderWithRouter(<MessagesPage />)

  const urgentBadges = screen.getAllByText(/^urgent$/i, { selector: 'span' })
  const receivedBadges = screen.getAllByText(/^received$/i)

  expect(urgentBadges.length).toBeGreaterThan(0)
  expect(receivedBadges.length).toBeGreaterThan(0)
})

  test('renders thread and reply buttons', () => {
    renderWithRouter(<MessagesPage />)

    expect(screen.getAllByRole('button', { name: /view full thread/i })).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: /reply/i })).toHaveLength(2)
  })

  test('shows reply count when present', () => {
    renderWithRouter(<MessagesPage />)

    expect(screen.getByText(/1 reply/i)).toBeInTheDocument()
  })

  test('compose button is clickable', async () => {
    const user = userEvent.setup()
    renderWithRouter(<MessagesPage />)

    await user.click(screen.getByRole('button', { name: /compose message/i }))
    expect(screen.getByRole('button', { name: /compose message/i })).toBeInTheDocument()
  })
})