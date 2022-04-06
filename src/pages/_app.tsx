import { AppProps } from 'next/app'
import { theme } from '../styles/theme'
import { ChakraProvider } from '@chakra-ui/react'

import { makeServer } from '../services/mirage';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '../services/queryClient';
import { ReactQueryDevtools } from 'react-query/devtools';
import { SidebarDrawerProvider } from '../contexts/SidebarDrawerContext';

// Verifica se a aplicação está rodando em ambiente de desenvolvimento
if (process.env.NODE_ENV === 'development') {
  makeServer();
}

// Sempre que for usar cache tem que usar o QueryClientProvider

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <SidebarDrawerProvider>
          <Component {...pageProps} />
        </SidebarDrawerProvider>
      </ChakraProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default MyApp
