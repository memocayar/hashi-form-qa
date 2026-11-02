# hashi-form-qa

Tests en Playwright + TypeScript corriendo contra el formulario real de postulación a QA Engineer en Hashi: https://tally.so/r/1A8Ay4

Estoy aplicando a esa posición. En vez de linkear un repo viejo de la facultad con Selenium y Java que no representa en nada cómo trabajo hoy, armé esto. Me pareció más honesto mostrar algo escrito esta semana, con las herramientas que uso ahora, probando justo el formulario que se está usando para evaluarme.

## Qué prueba

- Que la página carga y el contenido del puesto se ve bien (smoke test).
- Que enviar el formulario vacío no lo manda a ningún lado y marca los campos obligatorios como inválidos.
- Que completar un campo lo saca de la lista de inválidos, sin que eso dispare un envío real.
- Que los campos clave (LinkedIn, salario, fecha de inicio, WhatsApp, video) tienen el tipo y el required que corresponde.
- Que el multiselect de tecnologías lista las opciones esperadas (Playwright, Cypress, Selenium, Vitest/Jest, Storybook, Visual Regression, Testing de APIs, Github Actions).
- Que los dos campos de carga de archivo aceptan un PDF. Uno es "Sube tu CV". El otro no tiene ninguna etiqueta visible, es un campo obligatorio sin título, algo que noté mirando el DOM y que dejé documentado en el test en vez de ignorarlo.

Son 7 tests, todos corriendo contra la página real, sin mocks.

## Por qué nunca toco el botón de Submit con un envío real

Esta es la decisión más importante del repo, por eso la separo.

Los tests nunca completan el formulario entero ni lo mandan de verdad. Si lo hiciera, cada corrida de CI, cada push, cada PR, le mandaría una postulación falsa a Hashi. Eso ensucia su proceso de selección por una cuestión de ego técnico y no tiene sentido.

En vez de eso, los tests prueban comportamiento real sin cruzar esa línea: validación con el form vacío, validación parcial, forma y tipo de los campos, comportamiento de carga de archivos, contenido del multiselect. Todo eso corre contra el DOM real y reacciona a interacciones reales, pero se detiene justo antes de generar un efecto en el mundo real que nadie pidió.

Es el mismo criterio que pide el puesto: saber distinguir qué vale la pena probar. Un test que pasa pero rompe algo afuera del sistema bajo prueba no es un buen test, es un capricho con checkmark verde.

## Correrlo

```
npm install
npx playwright install chromium
npm test
```

## CI

Corre en GitHub Actions en cada push y pull request a main. Ver `.github/workflows/test.yml`.
