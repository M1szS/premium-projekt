# Ram Maszyna
Aby zobaczyć naszą stronę, przejdź pod adres: [https://m1szs.github.io/premium-projekt/](https://m1szs.github.io/premium-projekt/)

Ten szablon zapewnia minimalną konfigurację, aby uruchomić React w Vite z HMR (Hot Module Replacement) oraz kilkoma zasadami ESLint.

Obecnie dostępne są dwie oficjalne wtyczki:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) wykorzystuje [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) wykorzystuje [SWC](https://swc.rs/)

## Kompilator React

Kompilator React nie jest domyślnie włączony w tym szablonie ze względu na jego wpływ na wydajność w trybie deweloperskim oraz podczas budowania aplikacji. Aby go dodać, zobacz tę [dokumentację
](https://react.dev/learn/react-compiler/installation).

## Rozszerzanie konfiguracji ESLint

Jeśli tworzysz aplikację produkcyjną, zalecamy użycie TypeScript z włączonymi regułami lintowania uwzględniającymi typy. Sprawdź [Szablon TS](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) aby dowiedzieć się, jak zintegrować TypeScript oraz [`typescript-eslint`](https://typescript-eslint.io) w twoim projekcie.

## Jak uruchomić projekt

Żeby uruchomić projekt należy pobrać [nodejs](https://nodejs.org/en/download), oraz wykonać następujące polecenia krok po kroku:

krok 1: `npm install` w głównym katalogu projektu<br>
krok 2: Ponowne uruchomienie VScode, należy upewnić się że wszystkie okna są zamknięte <br>
krok 3: `npm run dev` w tym samym katalogu
