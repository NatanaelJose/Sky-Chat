import { BrowserRouter as  Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home.tsx'
import Global from './components/Global.tsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/global" element={<Global/>} />
      </Routes>
    </Router>
  );
};

export default App;
