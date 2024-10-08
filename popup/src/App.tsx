import "./App.css";
import { Box, CssBaseline } from "@mui/joy";
import NavBar from "./components/NavBar";
import Content from "./components/Content";

const App = () => {
  return (
    <Box>
      <CssBaseline />
      <NavBar />
      <Content />
    </Box>
  );
};

export default App;
