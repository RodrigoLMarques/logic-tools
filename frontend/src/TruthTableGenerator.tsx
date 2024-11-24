import { Toaster } from "react-hot-toast";
import GitHubCard from "./GitHubCard";
import Header from "./Header";
import OperatorLegend from "./OperatorLegend";
import TruthTableCard from "./TruthTableCard";

export default function TruthTableGenerator() {
  return (
    <div className="min-h-screen w-screen flex flex-col items-center space-y-8 p-8">
      <div className="mb-12">
        <Header />
      </div>
      <main className="flex flex-col items-center space-y-8 w-full md:flex-row md:justify-center md:items-start md:space-x-8 md:space-y-0">
        <div className="max-w-3xl md:w-3/5">
          <TruthTableCard />
        </div>
        <div className="md:w-2/7">
          <OperatorLegend />
        </div>
      </main>
      <GitHubCard
        name="RodrigoLMarques/logic-tools"
        githubUrl="https://github.com/RodrigoLMarques/logic-tools"
      />
      <Toaster />
    </div>
  );
}
