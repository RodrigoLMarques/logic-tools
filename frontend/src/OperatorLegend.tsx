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
  { operator: "AND", precedence: 2, symbols: ["AND", "&"] },
  { operator: "OR", precedence: 2, symbols: ["OR", "|"] },
  { operator: "NOT", precedence: 3, symbols: ["NOT", "!", "~"] },
  { operator: "XOR", precedence: 2, symbols: ["XOR", "^"] },
  { operator: "IMPLIES", precedence: 3, symbols: ["IMPLIES", "->", "=>"] },
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
