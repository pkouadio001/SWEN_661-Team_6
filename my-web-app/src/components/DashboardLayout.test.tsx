import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { DashboardLayout } from './DashboardLayout'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('DashboardLayout', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  test('renders outlet child content', () => {
    renderAt('/medications')

    expect(screen.getByText(/test child content/i)).toBeInTheDocument()
  })

  test('shows page label based on current route', () => {
    renderAt('/medications')

    expect(screen.getByText(/medications/i)).toBeInTheDocument()
  })

  test('renders navigation links', () => {
    renderAt('/dashboard')

    expect(screen.getByRole('link', { name: /careconnect/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /medications/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /appointments/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /health log/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /emergency/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /account/i })).toBeInTheDocument()
  })

  test('sign out button navigates home', async () => {
    const user = userEvent.setup()
    renderAt('/dashboard')

    await user.click(screen.getByRole('button', { name: /sign out/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})

function renderAt(initialPath: string) {
  return require('@testing-library/react').render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<div>Test Child Content</div>} />
          <Route path="/medications" element={<div>Test Child Content</div>} />
          <Route path="/appointments" element={<div>Test Child Content</div>} />
          <Route path="/healthlog" element={<div>Test Child Content</div>} />
          <Route path="/emergency" element={<div>Test Child Content</div>} />
          <Route path="/account-settings" element={<div>Test Child Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}