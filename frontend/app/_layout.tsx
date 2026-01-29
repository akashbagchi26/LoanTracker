import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <AutocompleteDropdownContextProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen
            name="(protected)"
            options={{
              headerShown: false,
              animation: "none",
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
              animation: "none",
            }}
          />
        </Stack>
      </QueryClientProvider>
    </AutocompleteDropdownContextProvider>
  );
}
