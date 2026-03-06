import { test, expect } from '@playwright/test'

test.describe('Dashboard Ipê City', () => {
  test('page loads and city with buildings is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Ipê City/)
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible({ timeout: 10000 })
  })

  test('project names appear in the scene', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('canvas', { timeout: 10000 })
    await expect(page.getByText('Portal Ipê').first()).toBeVisible({ timeout: 8000 })
  })
})
