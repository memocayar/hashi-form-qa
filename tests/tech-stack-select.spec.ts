import { test, expect } from '@playwright/test';

const EXPECTED_TECHNOLOGIES = [
  'Playwright',
  'Cypress',
  'Selenium',
  'Vitest/Jest',
  'Storybook',
  'Visual Regression',
  'Testing de APIs',
  'Github Actions',
];

test('el multi-select de tecnologías lista las opciones esperadas', async ({ page }) => {
  await page.goto('/r/1A8Ay4');

  const techField = page.getByLabel('Con qué tecnologías y frameworks tienes experiencia');
  await techField.click();

  const options = page.getByRole('option');
  await expect(options.first()).toBeVisible();

  const optionTexts = (await options.allInnerTexts()).join(' | ');

  for (const tech of EXPECTED_TECHNOLOGIES) {
    expect(optionTexts).toContain(tech);
  }

  // cerramos el dropdown sin elegir nada, no hace falta para lo que estamos probando
  await page.keyboard.press('Escape');
});
