import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from '../context/AppContext';
import { Toaster } from 'sonner';
import { ThemeProvider, useTheme } from 'next-themes';

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={resolvedTheme === 'light' ? 'light' : 'dark'}
    />
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
      <AppProvider>
        <RouterProvider router={router} />
        <ThemedToaster />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
