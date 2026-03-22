import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HealthLogPage from './HealthLogPage'
import { renderWithRouter } from '../test-utils'

describe('HealthLogPage', () => {
  test('renders page header', () => {
    renderWithRouter(<HealthLogPage />)

    expect(screen.getByText(/^Health Log$/i)).toBeInTheDocument()
    expect(
      screen.getByText(/track your daily health and symptoms/i)
    ).toBeInTheDocument()
  })

  test('renders initial health entries', () => {
    renderWithRouter(<HealthLogPage />)

    expect(screen.getByText(/friday, march 13, 2026/i)).toBeInTheDocument()
    expect(screen.getByText(/thursday, march 12, 2026/i)).toBeInTheDocument()
    expect(screen.getByText(/good mood/i)).toBeInTheDocument()
    expect(screen.getByText(/neutral mood/i)).toBeInTheDocument()
  })

  test('shows initial symptoms and medications', () => {
    renderWithRouter(<HealthLogPage />)

    expect(screen.getByText(/mild tremor/i)).toBeInTheDocument()
    expect(screen.getByText(/levodopa 100mg at 8:00 am/i)).toBeInTheDocument()
    expect(
      screen.getByText(/afternoon energy dip\. tremor increased before medication\./i)
    ).toBeInTheDocument()
  })

  test('opens add entry modal', async () => {
    const user = userEvent.setup()
    renderWithRouter(<HealthLogPage />)

    await user.click(screen.getByRole('button', { name: /add health entry/i }))

    expect(
      screen.getByRole('heading', { name: /add health entry/i })
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/date \(e\.g\. friday, march 14, 2026\)/i)
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/time \(e\.g\. 8:00 am\)/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/^notes$/i)).toBeInTheDocument()
  })

  test('adds a new health entry', async () => {
    const user = userEvent.setup()
    renderWithRouter(<HealthLogPage />)

    await user.click(screen.getByRole('button', { name: /add health entry/i }))

    await user.type(
      screen.getByPlaceholderText(/date \(e\.g\. friday, march 14, 2026\)/i),
      'Saturday, March 14, 2026'
    )
    await user.type(
      screen.getByPlaceholderText(/time \(e\.g\. 8:00 am\)/i),
      '9:00 AM'
    )
    await user.type(screen.getByPlaceholderText(/^notes$/i), 'Feeling better today.')
    await user.type(
      screen.getByPlaceholderText(/^medications taken$/i),
      'Vitamin D at 9:00 AM'
    )
    await user.type(
      screen.getByPlaceholderText(/symptoms \(comma separated\)/i),
      'Fatigue, Tremor'
    )

    await user.selectOptions(screen.getByRole('combobox'), 'Poor Mood')

    const sliders = screen.getAllByRole('slider')
    await user.type(sliders[0], '{selectall}8')
    await user.type(sliders[1], '{selectall}2')
    await user.type(sliders[2], '{selectall}4')

    await user.click(screen.getByRole('button', { name: /^add entry$/i }))

expect(screen.getByText(/saturday, march 14, 2026/i)).toBeInTheDocument()
expect(screen.getByText(/^9:00 AM$/i)).toBeInTheDocument()
expect(screen.getByText(/feeling better today\./i)).toBeInTheDocument()
expect(screen.getByText(/vitamin d at 9:00 am/i)).toBeInTheDocument()
expect(screen.getAllByText(/^fatigue$/i).length).toBeGreaterThan(0)
expect(screen.getAllByText(/^tremor$/i).length).toBeGreaterThan(0)

    const poorMoodBadges = screen.getAllByText(/poor mood/i)
    expect(poorMoodBadges.length).toBeGreaterThan(0)
  })

  test('does not add entry when date is empty', async () => {
    const user = userEvent.setup()
    renderWithRouter(<HealthLogPage />)

    const initialDates = screen.getAllByText(/march 1[23], 2026/i).length

    await user.click(screen.getByRole('button', { name: /add health entry/i }))
    await user.click(screen.getByRole('button', { name: /^add entry$/i }))

    expect(
      screen.getByRole('heading', { name: /add health entry/i })
    ).toBeInTheDocument()

    expect(screen.getAllByText(/march 1[23], 2026/i)).toHaveLength(initialDates)
    expect(screen.queryByText(/saturday, march 14, 2026/i)).not.toBeInTheDocument()
  })

  test('closes modal when cancel is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<HealthLogPage />)

    await user.click(screen.getByRole('button', { name: /add health entry/i }))
    await user.click(screen.getByRole('button', { name: /^cancel$/i }))

    expect(
      screen.queryByRole('heading', { name: /add health entry/i })
    ).not.toBeInTheDocument()
  })

  test('shows view full details buttons for entries', () => {
    renderWithRouter(<HealthLogPage />)

    const buttons = screen.getAllByRole('button', { name: /view full details/i })
    expect(buttons.length).toBeGreaterThan(0)
  })
})