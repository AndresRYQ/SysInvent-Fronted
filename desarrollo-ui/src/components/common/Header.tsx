import '../../styles/layout.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__title">Sistema de Inventario de Almacén</h1>
      </div>
      <div className="header__right">
        <span className="header__user">Admin</span>
      </div>
    </header>
  );
}
