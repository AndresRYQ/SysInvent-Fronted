import { NavLink } from 'react-router-dom';
import '../../styles/layout.css';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/ingresos', label: 'Ingresos de Almacén', icon: '📦' },
  { to: '/vales-consumo', label: 'Vales de Consumo', icon: '📋' },
  { to: '/productos', label: 'Productos', icon: '🏷️' },
  { to: '/proveedores', label: 'Proveedores', icon: '🤝' },
  { to: '/control-almacen', label: 'Control de Almacén', icon: '🔒' },
  { to: '/reportes', label: 'Reportes', icon: '📈' },
  { to: '/usuarios', label: 'Usuarios', icon: '👥' },
  { to: '/roles', label: 'Roles', icon: '🔑' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-icon">🌱</span>
        <span className="sidebar__brand-text">SysInvent</span>
      </div>
      <nav className="sidebar__nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            <span className="sidebar__link-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
