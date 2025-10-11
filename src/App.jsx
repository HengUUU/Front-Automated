import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import EntryPlatform from './pages/Entrypage';
import Home from './pages/Home';
import Graph from './pages/Graph';
import Poster from './pages/Poster';
import Plot from './pages/plot';
import PrivateRoute from './PrivateRout';
import FactoriesPage from './pages/Factories_information';
import { FactoryDataProvider } from './context/FactoryDataContext'; // <-- import context provider

function App() {
  return (
    <BrowserRouter>
      <FactoryDataProvider>
        <Routes>
          <Route path='/login' element={<EntryPlatform />} />
          <Route path='/home' element={<PrivateRoute><Home/></PrivateRoute>} />
          <Route path='/graph' element={<PrivateRoute><Graph/></PrivateRoute>} />
          <Route path='/plot' element={<PrivateRoute><Plot/></PrivateRoute>} />
          <Route path='/factories' element={<PrivateRoute><FactoriesPage/></PrivateRoute>}/>
          <Route path='/poster' element={<PrivateRoute><Poster/></PrivateRoute>} />
          <Route path='/' element={<Navigate to="/login" replace />} />
        </Routes>
      </FactoryDataProvider>
    </BrowserRouter>
  );
}

export default App;