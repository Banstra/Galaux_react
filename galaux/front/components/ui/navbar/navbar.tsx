import Image from 'next/image';

export function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Лаунчер</a>
            </li>
            <li>
              <a>Техподдержка</a>
            </li>
            <li>
              <a>Контакты</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">
          <Image
            src={'/logo.svg'}
            alt={'logo'}
            width={100}
            height={100}
            loading={'eager'}
          ></Image>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Лаунчер</a>
          </li>
          <li>
            <a>Техподдержка</a>
          </li>
          <li>
            <a>Контакты</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn" href={'/auth/login'}>Войти</a>
      </div>
    </div>
  );
}