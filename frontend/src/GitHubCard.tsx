// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Github } from "lucide-react";

// interface GitHubCardProps {
//   name: string;
//   githubUrl: string;
// }

// export default function GitHubCard({ name, githubUrl }: GitHubCardProps) {
//   return (
//     <Card className="fixed bottom-4 left-4 bg-[#24292e] text-white shadow-lg">
//       <CardContent className="p-4 flex items-center space-x-3">
//         <Github size={24} />
//         <span className="font-medium">{name}</span>
//         <Button
//           variant="outline"
//           size="sm"
//           className="bg-[#2ea44f] text-white border-[#2ea44f] hover:bg-[#2c974b] hover:border-[#2c974b]"
//           onClick={() => window.open(githubUrl, "_blank")}
//         >
//           View GitHub
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

import { Card, CardContent } from "@/components/ui/card";
import { Github } from "lucide-react";

interface GitHubCardProps {
  name: string;
  githubUrl: string;
}

export default function GitHubCard({ name, githubUrl }: GitHubCardProps) {
  return (
    <a href={githubUrl} target="_blank" rel="noopener noreferrer">
      <Card className="fixed bottom-2 left-2 bg-background hover:bg-secondary transition-colors duration-200 shadow-sm">
        <CardContent className="p-2 flex items-center space-x-2">
          <Github size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{name}</span>
        </CardContent>
      </Card>
    </a>
  );
}
