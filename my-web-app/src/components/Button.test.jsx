import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

function Button({ onClick }) {
  return <button onClick={onClick}>Save</button>
}

test('calls onClick when clicked', async () => {
  const user = userEvent.setup()
  const handleClick = jest.fn()

  render(<Button onClick={handleClick} />)

  await user.click(screen.getByRole('button', { name: /save/i }))

  expect(handleClick).toHaveBeenCalledTimes(1)
})