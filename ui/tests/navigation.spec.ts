import { expect, test, type Locator } from '@playwright/test'

test.describe('Navigation', async () => {
  let breadcrumb: Locator

  test.beforeEach(async ({ page }) => {
    breadcrumb = page.getByLabel('Breadcrumb')

    await page.goto('/')
  })

  test.describe('navigates to Monitor', async () => {
    test('Pepr page', async ({ page }) => {
      await page.getByRole('button', { name: 'Monitor' }).click()
      await page.getByRole('link', { name: 'Pepr' }).click()

      await expect(breadcrumb.getByRole('link', { name: 'Monitor' })).toBeVisible()
      await expect(breadcrumb.getByRole('link', { name: 'Pepr' })).toBeVisible()
    })

    test('Events page', async ({ page }) => {
      await page.getByRole('button', { name: 'Monitor' }).click()
      await page.getByRole('link', { name: 'Events' }).click()

      await expect(breadcrumb.getByRole('link', { name: 'Monitor' })).toBeVisible()
      await expect(breadcrumb.getByRole('link', { name: 'Events' })).toBeVisible()
    })
  })

  test.describe('navigates to Workloads', async () => {
    test('Pods page', async ({ page }) => {
      await page.getByRole('button', { name: 'Workloads' }).click()
      await page.getByRole('link', { name: 'Pods' }).click()
      await expect(breadcrumb.getByRole('link', { name: 'Workloads' })).toBeVisible()
      await expect(breadcrumb.getByRole('link', { name: 'Pods' })).toBeVisible()
    })

    test('Deployments page', async ({ page }) => {
      await page.getByRole('button', { name: 'Workloads' }).click()
      await page.getByRole('link', { name: 'Deployments' }).click()
      await expect(breadcrumb.getByRole('link', { name: 'Workloads' })).toBeVisible()
      await expect(breadcrumb.getByRole('link', { name: 'Deployments' })).toBeVisible()
    })
  })

  test.describe('navigates to Network', async () => {
    test('Services page', async ({ page }) => {
      await page.getByRole('button', { name: 'Network' }).click()
      await page.getByRole('link', { name: /^Services$/ }).click()
      await expect(breadcrumb.getByRole('link', { name: 'Network' })).toBeVisible()
      await expect(breadcrumb.getByRole('link', { name: 'Services' })).toBeVisible()
    })
  })

  test.describe('navigates to Config', async () => {
    test('Packages page', async ({ page }) => {
      await page.getByRole('button', { name: 'Config' }).click()
      await page.getByRole('link', { name: 'UDS Packages' }).click()
      await expect(breadcrumb.getByRole('link', { name: 'Config' })).toBeVisible()
      await expect(breadcrumb.getByRole('link', { name: 'UDS Packages' })).toBeVisible()
    })
  })

  test('Namespaces page', async ({ page }) => {
    await page.getByRole('link', { name: 'Namespaces' }).click()
    await expect(breadcrumb.getByRole('link', { name: 'Namespaces' })).toBeVisible()
  })

  test('navigates to Docs page', async ({ page }) => {
    await page.getByRole('link', { name: 'Docs' }).click()

    await expect(page.locator('h1')).toHaveText('Docs')
  })

  test('navigates to Preferences page', async ({ page }) => {
    await page.getByTestId('global-sidenav-preferences').click()

    await expect(page.locator('h1')).toHaveText('Preferences')
  })

  test('navigates to Settings page', async ({ page }) => {
    await page.getByTestId('global-sidenav-settings').click()

    await expect(page.locator('h1')).toHaveText('Settings')
  })

  test('navigates to Help page', async ({ page }) => {
    await page.getByTestId('global-sidenav-help').click()

    await expect(page.locator('h1')).toHaveText('Help')
  })
})