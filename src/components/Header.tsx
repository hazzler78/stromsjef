import Link from 'next/link';
import Logo from './Logo';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Logo width={32} height={40} />
          <span className="text-2xl font-bold">Strømsjef</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">Sammenlign</Link>
            </li>
            <li>
              <Link href="/spotpriskontroll">Spotpriskontroll</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 