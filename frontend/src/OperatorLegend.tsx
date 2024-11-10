import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const operatorMappings = [
  { operator: "E", precedence: 2, symbols: ["AND", "&"] },
  { operator: "OU", precedence: 2, symbols: ["OR", "|"] },
  { operator: "NÃO", precedence: 3, symbols: ["NOT", "!", "~"] },
  { operator: "OU Exclusivo", precedence: 2, symbols: ["XOR", "^"] },
  { operator: "IMPLICA", precedence: 3, symbols: ["IMPLIES", "->", "=>"] },
];

export default function OperatorLegend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operadores Lógicos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Operador</TableHead>
              <TableHead>Símbolos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operatorMappings.map((op) => (
              <TableRow key={op.operator}>
                <TableCell className="font-medium">{op.operator}</TableCell>
                <TableCell>{op.symbols.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
