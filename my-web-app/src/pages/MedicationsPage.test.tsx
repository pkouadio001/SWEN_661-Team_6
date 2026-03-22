import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MedicationsPage from './MedicationsPage'
import { renderWithRouter } from '../test-utils'

describe('MedicationsPage', () => {
  test('renders page header', () => {
    renderWithRouter(<MedicationsPage />)

    expect(screen.getByText(/^my medications$/i)).toBeInTheDocument()
    expect(screen.getByText(/manage your medication schedule/i)).toBeInTheDocument()
  })

  test('renders initial medications', () => {
    renderWithRouter(<MedicationsPage />)

    expect(screen.getByText(/levodopa\/carbidopa/i)).toBeInTheDocument()
    expect(screen.getByText(/vitamin d3/i)).toBeInTheDocument()
    expect(screen.getByText(/^100\/25mg$/i)).toBeInTheDocument()
    expect(screen.getByText(/^2000 iu$/i)).toBeInTheDocument()
  })

  test('filters medications by search text', async () => {
    const user = userEvent.setup()
    renderWithRouter(<MedicationsPage />)

    await user.type(
      screen.getByPlaceholderText(/search by name or category/i),
      'vitamin'
    )

    expect(screen.getByText(/vitamin d3/i)).toBeInTheDocument()
    expect(screen.queryByText(/levodopa\/carbidopa/i)).not.toBeInTheDocument()
  })

  test('filters medications by category', async () => {
    const user = userEvent.setup()
    renderWithRouter(<MedicationsPage />)

    await user.selectOptions(screen.getByDisplayValue(/all categories/i), 'Supplement')

    expect(screen.getByText(/vitamin d3/i)).toBeInTheDocument()
    expect(screen.queryByText(/levodopa\/carbidopa/i)).not.toBeInTheDocument()
  })

  test('sorts medications by name', async () => {
    const user = userEvent.setup()
    renderWithRouter(<MedicationsPage />)

    await user.selectOptions(screen.getByDisplayValue(/^name$/i), 'Name')

    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings[0]).toHaveTextContent(/levodopa\/carbidopa/i)
    expect(headings[1]).toHaveTextContent(/vitamin d3/i)
  })

  test('opens add medication modal', async () => {
    const user = userEvent.setup()
    renderWithRouter(<MedicationsPage />)

    await user.click(screen.getByRole('button', { name: /^add medication$/i }))

    expect(screen.getByRole('heading', { name: /^add medication$/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/^Medication Name$/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/^Category \(e\.g\. Supplement\)$/i)
    ).toBeInTheDocument()
  })

  test('adds a new medication', async () => {
    const user = userEvent.setup()
    renderWithRouter(<MedicationsPage />)

    await user.click(screen.getByRole('button', { name: /^add medication$/i }))

    await user.type(screen.getByPlaceholderText(/^Medication Name$/i), 'Aspirin')
    await user.type(
      screen.getByPlaceholderText(/^Category \(e\.g\. Supplement\)$/i),
      'General'
    )
    await user.type(
      screen.getByPlaceholderText(/^Dosage \(e\.g\. 100mg\)$/i),
      '81mg'
    )
    await user.type(
      screen.getByPlaceholderText(/^Frequency \(e\.g\. Once daily\)$/i),
      'Once daily'
    )
    await user.type(
      screen.getByPlaceholderText(/^Times \(comma separated, e\.g\. 8:00 AM, 2:00 PM\)$/i),
      '9:00 AM'
    )
    await user.type(screen.getByPlaceholderText(/^Prescribed By$/i), 'Dr. Adams')
    await user.type(screen.getByPlaceholderText(/^Instructions$/i), 'Take after breakfast')

    const modal = screen.getByRole('heading', { name: /^add medication$/i }).closest('div')!
    const addButtons = within(modal).getAllByRole('button', { name: /^add medication$/i })
    await user.click(addButtons[addButtons.length - 1])

    expect(screen.getByText(/^aspirin$/i)).toBeInTheDocument()
    expect(screen.getByText(/^81mg$/i)).toBeInTheDocument()
    expect(screen.getByText(/dr\. adams/i)).toBeInTheDocument()
    expect(screen.getByText(/take after breakfast/i)).toBeInTheDocument()
    expect(screen.getByText(/^9:00 AM$/i)).toBeInTheDocument()
  })

  test('does not add medication when name is empty', async () => {
    const user = userEvent.setup()
    renderWithRouter(<MedicationsPage />)

    await user.click(screen.getByRole('button', { name: /^add medication$/i }))

    const modal = screen.getByRole('heading', { name: /^add medication$/i }).closest('div')!
    const addButtons = within(modal).getAllByRole('button', { name: /^add medication$/i })
    await user.click(addButtons[addButtons.length - 1])

    expect(screen.queryByText(/^aspirin$/i)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^add medication$/i })).toBeInTheDocument()
  })

  test('closes modal when cancel is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<MedicationsPage />)

    await user.click(screen.getByRole('button', { name: /^add medication$/i }))
    await user.click(screen.getByRole('button', { name: /^cancel$/i }))

    expect(screen.queryByRole('heading', { name: /^add medication$/i })).not.toBeInTheDocument()
  })

test('deletes a medication', async () => {
  const user = userEvent.setup()
  renderWithRouter(<MedicationsPage />)

  const vitaminHeading = screen.getByRole('heading', { name: /vitamin d3/i })

  const medCard = vitaminHeading.closest('div[style*="box-shadow"]')
  expect(medCard).toBeTruthy()

  const deleteButton = within(medCard as HTMLElement).getByRole('button', {
    name: /delete/i,
  })

  await user.click(deleteButton)

  expect(screen.queryByText(/vitamin d3/i)).not.toBeInTheDocument()
  expect(screen.getByText(/levodopa\/carbidopa/i)).toBeInTheDocument()
})

  test('renders edit and delete buttons', () => {
    renderWithRouter(<MedicationsPage />)

    expect(screen.getAllByRole('button', { name: /edit/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: /delete/i }).length).toBeGreaterThan(0)
  })
})