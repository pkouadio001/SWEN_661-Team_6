import { test, expect } from '@playwright/test'

test.describe('Dashboard page', () => {
  test('renders dashboard sections and action buttons', async ({ page }) => {
    // Adjust route if your dashboard is somewhere else
    await page.goto('/dashboard')

    await expect(page.getByText(/careconnect/i).first()).toBeVisible()
    await expect(page.getByText(/welcome,\s*john doe/i)).toBeVisible()

    await expect(
      page.getByRole('heading', { name: /quick actions/i })
    ).toBeVisible()

    await expect(
      page.getByRole('heading', { name: /today's schedule/i })
    ).toBeVisible()

    await expect(
      page.getByRole('heading', { name: /emergency contacts/i })
    ).toBeVisible()

    await expect(
      page.getByRole('heading', { name: /health summary/i })
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: /medications track your daily doses/i })
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: /appointments view upcoming visits/i })
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: /health log log symptoms and mood/i })
    ).toBeVisible()
  })
})