import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Managers from './pages/Managers';
import ThunderDome from './pages/ThunderDome';
import Media from './pages/Media';
import Legacy from './pages/Legacy';
import RuleSubmission from './pages/RuleSubmission';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/managers" element={<Managers />} />
          <Route path="/thunderdome" element={<ThunderDome />} />
          <Route path="/media" element={<Media />} />
          <Route path="/legacy" element={<Legacy />} />
          <Route path="/rules" element={<RuleSubmission />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
