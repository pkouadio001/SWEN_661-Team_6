import { test, expect } from '@playwright/test'

test.describe('Sign-in page', () => {
  test('renders sign-in form', async ({ page }) => {
    await page.goto('/signin')

    await expect(
      page.getByRole('heading', { name: /sign in to your account/i })
    ).toBeVisible()

    await expect(page.getByLabel(/email address/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /^sign in$/i })).toBeVisible()
  })

  test('fills demo credentials from demo section', async ({ page }) => {
    await page.goto('/signin')

    await page.getByRole('button', { name: /use demo credentials/i }).click()

    await expect(page.getByLabel(/email address/i)).toHaveValue('demo@careconnect.com')
    await expect(page.getByLabel(/password/i)).toHaveValue('demo123')
  })
})