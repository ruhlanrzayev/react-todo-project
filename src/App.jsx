import './App.css';
import Home from './pages/Home';
import TodoMain from './pages/TodoMain';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; 

function App() {
  return (
    <ThemeProvider>  {/* ThemeProvider */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<TodoMain />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
