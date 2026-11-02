import { test, expect } from '@playwright/test';

/**
 * Chequeo rápido de que el formulario carga y muestra lo que tiene que mostrar.
 * Si esto falla, nada de lo demás tiene sentido.
 */
test.describe('Carga del formulario', () => {
  test('la página carga y muestra el contenido clave del puesto', async ({ page }) => {
    await page.goto('/r/1A8Ay4');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('QA Engineer');
    await expect(page.getByText('Por qué abrimos esta posición')).toBeVisible();
    await expect(page.getByText('El rol y sus responsabilidades')).toBeVisible();
    await expect(page.getByText('Qué buscamos?')).toBeVisible();
    await expect(page.getByText('Completá el formulario para aplicar al puesto')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });
});
