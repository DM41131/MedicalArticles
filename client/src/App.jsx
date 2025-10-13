import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { AuthProvider } from './store/AuthContext';
import { routes } from './routes';

function App() {
  const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        {routing}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

