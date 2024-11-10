import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="w-full bg-background border-b fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">Logic Tools</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Button
                variant="ghost"
                className="text-foreground bg-white hover:bg-blue-500 hover:text-white transition-colors duration-200"
                onClick={() => (window.location.hash = "#truth-table")}
              >
                Tabela Verdade
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="text-foreground bg-white hover:bg-blue-500 hover:text-white transition-colors duration-200"
                onClick={() => (window.location.hash = "#proposition-validator")}
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