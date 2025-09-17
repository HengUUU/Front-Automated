import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import EntryPlatform from './pages/Entrypage';
import Home from './pages/Home';
import Graph from './pages/Graph';
import Poster from './pages/Poster';
import Plot from './pages/plot';
import { FactoryDataProvider } from './context/FactoryDataContext'; // <-- import context provider

function App() {
  return (
    <BrowserRouter>
      <FactoryDataProvider>
        <Routes>
          <Route path='/login' element={<EntryPlatform />} />
          <Route path='/home' element={<Home />} />
          <Route path='/graph' element={<Graph />} />
          <Route path='/plot' element={<Plot />} />
          <Route path='/poster' element={<Poster />} />
          <Route path='/' element={<Navigate to="/login" replace />} />
        </Routes>
      </FactoryDataProvider>
    </BrowserRouter>
  );
}

export default App;