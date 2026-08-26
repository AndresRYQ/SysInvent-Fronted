import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProveedoresPage from './pages/proveedores/ProveedoresPage';
import NuevoProveedorPage from './pages/proveedores/NuevoProveedorPage';
import EditarProveedorPage from './pages/proveedores/EditarProveedorPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProveedoresPage />} />
        <Route path="/proveedores" element={<ProveedoresPage />} />
        <Route path="/proveedores/nuevo" element={<NuevoProveedorPage />} />
        <Route path="/proveedores/editar/:id" element={<EditarProveedorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
