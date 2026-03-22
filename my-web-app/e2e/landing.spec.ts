import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('loads and shows main CTAs', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: /healthcare management/i })
    ).toBeVisible()

    await expect(
      page.getByRole('heading', { name: /designed for you/i })
    ).toBeVisible()

    await expect(page.getByRole('link', { name: /^sign in$/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /get started/i }).first()).toBeVisible()
  })

  test('navigates to sign-in page from CTA', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /sign in/i }).first().click()

    await expect(page).toHaveURL(/signin/i)
    await expect(
      page.getByRole('heading', { name: /sign in to your account/i })
    ).toBeVisible()
  })
})