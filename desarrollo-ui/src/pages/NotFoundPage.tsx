import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-placeholder">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <Link to="/dashboard">Volver al Dashboard</Link>
    </div>
  );
}
