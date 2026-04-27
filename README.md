# React + Vite

Ten szablon zapewnia minimalną konfigurację, aby uruchomić React w Vite z HMR (Hot Module Replacement) oraz kilkoma zasadami ESLint.

Obecnie dostępne są dwie oficjalne wtyczki:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Kompilator React

Kompilator React nie jest domyślnie włączony w tym szablonie ze względu na jego wpływ na wydajność w trybie deweloperskim oraz podczas budowania aplikacji. Aby go dodać, zobacz tę [dokumentację
](https://react.dev/learn/react-compiler/installation).

## Rozszerzanie konfiguracji ESLint

Jeśli tworzysz aplikację produkcyjną, zalecamy użycie TypeScript z włączonymi regułami lintowania uwzględniającymi typy. Sprawdź [Szablon TS](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) aby dowiedzieć się, jak zintegrować TypeScript oraz [`typescript-eslint`](https://typescript-eslint.io) w twoim projekcie.
