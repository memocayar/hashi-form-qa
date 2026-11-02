import { test, expect } from '@playwright/test';
import path from 'path';

const SAMPLE_PDF = path.join(__dirname, 'fixtures', 'sample-cv.pdf');

/**
 * El form tiene dos campos de carga de archivo. Uno es "Sube tu CV", con
 * etiqueta visible. El otro, antes en el formulario, es un campo de carga
 * obligatorio sin ningún texto asociado (title vacío en el DOM, confirmado
 * mirando el HTML real, no es un error de estos tests). Lo probamos por
 * posición porque no tiene accessible name del que agarrarse.
 */
test.describe('Carga de archivos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/r/1A8Ay4');
  });

  test('el campo de Subir CV acepta un PDF', async ({ page }) => {
    const cvInput = page.getByLabel('Sube tu CV');
    await cvInput.setInputFiles(SAMPLE_PDF);

    await expect(page.getByText('sample-cv.pdf')).toBeVisible();
  });

  test('el primer campo de carga de archivo (sin etiqueta) también acepta un PDF', async ({ page }) => {
    const fileInputs = page.locator('input[type="file"]');
    await expect(fileInputs).toHaveCount(2);

    await fileInputs.first().setInputFiles(SAMPLE_PDF);

    await expect(page.getByText('sample-cv.pdf')).toBeVisible();
  });
});
