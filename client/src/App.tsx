import { ChakraProvider, Grid, theme } from '@chakra-ui/react'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import { Jotter } from './views/Jotter/Jotter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>
      <Grid minH='100vh'>
        <ColorModeSwitcher justifySelf='flex-end' />
        <Jotter />
      </Grid>
    </ChakraProvider>
  </QueryClientProvider>
);
