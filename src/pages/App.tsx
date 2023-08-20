import { useState } from "react";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";

import Home from "./Home";

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <Home />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
