import GitHubCard from "./GitHubCard";
import Header from "./Header";
import OperatorLegend from "./OperatorLegend";
import TruthTableCard from "./TruthTableCard";

export default function TruthTableGenerator() {
  return (
    <div className="h-screen w-screen flex items-start justify-center space-x-8 p-8">
      <Header />
      <main className="flex-grow flex items-start justify-center space-x-8 p-8 mt-12">
        <div className="w-3/5 max-w-3xl">
          <TruthTableCard />
        </div>
        <div className="w-2/5">
          <OperatorLegend />
        </div>
      </main>
      <GitHubCard
        name="RodrigoLMarques"
        githubUrl="https://github.com/RodrigoLMarques"
      />
    </div>
  );
}
