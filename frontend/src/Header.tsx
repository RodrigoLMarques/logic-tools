import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="w-full bg-header-bg border-b fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-soft-white">Logic Tools</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Button
                variant="ghost"
                className="bg-soft-white text-header-bg hover:bg-gray-200 hover:text-header-bg transition-colors duration-200"
                onClick={() => (window.location.href = "/")}
              >
                Tabela Verdade
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="bg-soft-white text-header-bg hover:bg-gray-200 hover:text-header-bg transition-colors duration-200"
                onClick={() => (window.location.href = "/")}
              >
                ...
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
