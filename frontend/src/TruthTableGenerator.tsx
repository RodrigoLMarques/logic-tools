"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import "@/index.css";
import { useState } from "react";
import { identifyVariables } from "./identifyVariables";

const getTableTruthData = async (expr: string) => {
  const [expression, variables] = identifyVariables(expr);

  try {
    const url = "http://localhost:3000/tables/truth";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expression,
        variables,
      }),
    });

    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Erro:", error);
  }
};

export default function TruthTableGenerator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<Record<string, boolean[]> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateTruthTable = async () => {
    setIsLoading(true);
    try {
      const data = await getTableTruthData(expression);
      setResult(data as Record<string, boolean[]>);
    } catch (error) {
      console.error("Error generating truth table:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Gerador de Tabela Verdade</CardTitle>
          <CardDescription>
            Insira uma expressão lógica para gerar sua tabela verdade.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Insira a expressão lógica (exemplo: a & b)"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
            />
            <Button onClick={generateTruthTable} disabled={isLoading}>
              {isLoading ? "Gerando..." : "Gerar"}
            </Button>
          </div>

          {result && (
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(result)
                    .slice(0, -1)
                    .map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  <TableHead>{expression}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result[Object.keys(result)[0]].map((_, index) => (
                  <TableRow key={index}>
                    {Object.keys(result)
                      .slice(0, -1)
                      .map((key) => (
                        <TableCell key={`${key}-${index}`}>
                          {result[key][index] ? "V" : "F"}
                        </TableCell>
                      ))}
                    <TableCell>
                      {result[Object.keys(result).slice(-1)[0]][index]
                        ? "V"
                        : "F"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
