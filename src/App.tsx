import { BrowserRouter as  Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home.tsx'
import Global from './components/Global.tsx';
import LoginForm from './components/LoginForm.tsx';
import Config from './components/Config.tsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/global" element={<Global/>} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/config" element={<Config/>} />
      </Routes>
    </Router>
  );
};

export default App;
