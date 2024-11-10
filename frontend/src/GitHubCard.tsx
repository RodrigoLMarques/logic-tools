import { Card, CardContent } from "@/components/ui/card";
import { Github } from "lucide-react";

interface GitHubCardProps {
  name: string;
  githubUrl: string;
}

export default function GitHubCard({ name, githubUrl }: GitHubCardProps) {
  return (
    <a href={githubUrl} target="_blank" rel="noopener noreferrer">
      <Card className="fixed bottom-2 right-2 bg-black hover:bg-gray-800 transition-colors duration-200 shadow-sm">
        <CardContent className="p-2 flex items-center space-x-2">
          <Github size={16} className="text-white" />
          <span className="text-sm text-white">{name}</span>
        </CardContent>
      </Card>
    </a>
  );
}
