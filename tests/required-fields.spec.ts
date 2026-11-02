import { test, expect } from '@playwright/test';

/**
 * Estos tests nunca llenan el formulario entero ni tocan Submit con datos reales.
 * Ver README para el porqué: no queremos que cada corrida de CI le mande una
 * postulación falsa a Hashi.
 */
test.describe('Validación de campos obligatorios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/r/1A8Ay4');
  });

  test('enviar el formulario vacío no lo manda y marca los campos obligatorios', async ({ page }) => {
    const urlBefore = page.url();

    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(800);

    // Si esto se hubiera enviado de verdad, Tally cambia de URL (pantalla de
    // agradecimiento). Comprobamos justo lo contrario: seguimos en el form.
    expect(page.url()).toBe(urlBefore);
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();

    const invalidFields = page.locator('[aria-invalid="true"]');
    expect(await invalidFields.count()).toBeGreaterThanOrEqual(9);
  });

  test('completar un campo lo saca de la lista de inválidos sin disparar el envío', async ({ page }) => {
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(500);

    const invalidCountBefore = await page.locator('[aria-invalid="true"]').count();

    const bioField = page.getByLabel('Describe tu experiencia trabajando en equipo');
    await bioField.fill('Dos años en equipos ágiles, QA integrado al sprint, daily y retro incluidas.');
    await bioField.blur();
    await page.waitForTimeout(500);

    await expect(bioField).toHaveAttribute('aria-invalid', 'false');

    const invalidCountAfter = await page.locator('[aria-invalid="true"]').count();
    expect(invalidCountAfter).toBeLessThan(invalidCountBefore);

    // seguimos en el form: nadie tocó Submit con el formulario completo
    expect(page.url()).toContain('tally.so/r/1A8Ay4');
  });

  test('los campos de texto clave tienen el tipo y el required que deberían', async ({ page }) => {
    const linkedin = page.getByLabel('Perfil de Linkedin');
    await expect(linkedin).toHaveAttribute('type', 'url');
    await expect(linkedin).toHaveJSProperty('required', true);

    const salary = page.getByLabel('Cuales son tus pretensiones salariales');
    await expect(salary).toHaveAttribute('placeholder', 'En USDT');
    await expect(salary).toHaveJSProperty('required', true);

    const startDate = page.getByLabel('Cuándo se podría dar tu incorporación');
    await expect(startDate).toHaveAttribute('placeholder', 'Fecha estimada de incorporación');
    await expect(startDate).toHaveJSProperty('required', true);

    // Estos dos son opcionales: WhatsApp y el video de presentación.
    const whatsapp = page.getByLabel('Para una comunicación más fluida');
    await expect(whatsapp).toHaveJSProperty('required', false);

    const video = page.getByLabel('Video corto de presentación');
    await expect(video).toHaveJSProperty('required', false);
  });
});
