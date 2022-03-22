import Header from "./components/Header";
import Theme from "./theme/Theme";
import { useState } from "react";
import { ThemeContext } from "./theme/ThemeContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const App = () => {
  const [ourMode, setOurMode] = useState("light");
  const ourTheme = Theme(ourMode);
  return (
    <ThemeContext.Provider value={{ ourTheme }}>
      <ThemeProvider theme={ourTheme}>
        <CssBaseline />
        <Header ourMode={ourMode} setOurMode={setOurMode} />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;
