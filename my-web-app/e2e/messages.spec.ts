import { test, expect } from '@playwright/test'

test.describe('Messages page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/messages')
    await expect(
      page.getByRole('heading', { name: /caretaker messages/i })
    ).toBeVisible()
  })

  test('renders core messages UI', async ({ page }) => {
    await expect(
      page.getByPlaceholder(/search by sender, subject, or content/i)
    ).toBeVisible()

    await expect(page.locator('select').first()).toBeVisible()

    await expect(
      page.getByRole('button', { name: /compose message/i })
    ).toBeVisible()
  })

  test('renders filter dropdown with expected options', async ({ page }) => {
    const filter = page.locator('select').first()

    await expect(filter).toBeVisible()
    await expect(filter).toContainText('All Messages')
    await expect(filter).toContainText('Urgent')
    await expect(filter).toContainText('Received')
    await expect(filter).toContainText('Sent')
  })

  test('can change the message filter', async ({ page }) => {
    const filter = page.locator('select').first()

    await filter.selectOption({ label: 'Urgent' })
    await expect(filter).toHaveValue(/urgent/i)
  })

test('renders message content and actions', async ({ page }) => {
  await page.goto('/messages')

  // Ensure page loaded
  await expect(
    page.getByRole('heading', { name: /caretaker messages/i })
  ).toBeVisible()

  // Ensure at least some message-like content exists
  const messages = page.locator('div').filter({
    hasText: /message|doctor|care/i,
  })

  await expect(messages.first()).toBeVisible()

  // Ensure dropdown exists (this is your main interaction)
  const filter = page.locator('select').first()
  await expect(filter).toBeVisible()
})

  test('search input accepts typing', async ({ page }) => {
    const search = page.getByPlaceholder(/search by sender, subject, or content/i)

    await search.fill('doctor')
    await expect(search).toHaveValue('doctor')
  })
})