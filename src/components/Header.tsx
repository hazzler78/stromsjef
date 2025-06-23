import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Strømsjef
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