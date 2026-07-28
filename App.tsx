import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './src/lib/reactQueryClient'
import ProductListScreen from './src/screens/ProductListScreen'

function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <ProductListScreen />
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}

export default App
