import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import boundaries from "eslint-plugin-boundaries"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    files: ["src/**/*"],
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app" },
        { type: "views", pattern: "src/views" },
        { type: "widgets", pattern: "src/widgets" },
        { type: "features", pattern: "src/features" },
        { type: "entities", pattern: "src/entities" },
        { type: "shared", pattern: "src/shared" },
      ],
      "boundaries/ignore": ["src/**/@*/**"],
      // Отключаем детекцию устаревшего синтаксиса для ускорения линтинга
      "boundaries/legacy-warnings": false, 
    },
    rules: {
      // Ипользуем новое имя правила вместо boundaries/element-types
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          // Обновленный синтаксис шаблона вывода ошибки
          message: "{{from.element.types.[0]}} не может импортировать из {{to.element.types.[0]}}",
          // Используем актуальный ключ policies вместо rules
          policies: [
            {
              from: { element: { type: "shared" } },
              disallow: [
                { to: { element: { type: "app" } } },
                { to: { element: { type: "views" } } },
                { to: { element: { type: "widgets" } } },
                { to: { element: { type: "features" } } },
                { to: { element: { type: "entities" } } },
              ],
            },
            {
              from: { element: { type: "entities" } },
              disallow: [
                { to: { element: { type: "app" } } },
                { to: { element: { type: "views" } } },
                { to: { element: { type: "widgets" } } },
                { to: { element: { type: "features" } } },
              ],
            },
            {
              from: { element: { type: "features" } },
              disallow: [
                { to: { element: { type: "app" } } },
                { to: { element: { type: "views" } } },
                { to: { element: { type: "widgets" } } },
              ],
            },
            {
              from: { element: { type: "widgets" } },
              disallow: [
                { to: { element: { type: "app" } } },
                { to: { element: { type: "views" } } },
              ],
            },
            {
              from: { element: { type: "views" } },
              disallow: [
                { to: { element: { type: "app" } } },
              ],
            },
          ],
        },
      ],
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "eslint.config.mjs",
    "next.config.mjs",
    "tailwind.config.ts",
  ]),
])

export default eslintConfig
