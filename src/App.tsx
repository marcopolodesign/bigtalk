import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { PlayerSetup } from './pages/PlayerSetup';
import { Categories } from './pages/Categories';
import { Game } from './pages/Game';
import { End } from './pages/End';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup" element={<PlayerSetup />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/game" element={<Game />} />
          <Route path="/end" element={<End />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
