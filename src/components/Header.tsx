import { Link } from "react-router-dom";

export function Header() {
  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-center w-full bg-zinc-800 py-5 gap-5">
        <h1 className="text-4xl font-semibold text-center text-zinc-100 w-full">
          Calculadora do Brasil
        </h1>

        <nav className="flex flex-row justify-around w-full md:justify-end md:gap-5 md:justify-center">
          <Link className="text-white hover:opacity-50" to="/">Investimento</Link>
          <Link className="text-white hover:opacity-50" to="/imposto-de-importacao">Imposto de importação</Link>
        </nav>
      </header>
    </div>
  );
}
