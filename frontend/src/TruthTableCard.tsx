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
import { useState } from "react";

const getTableTruthData = async (expressions: string[]) => {
  try {
    const url = "http://localhost:3000/tables/truth";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expressions,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
};

type ResultColumn = {
  expression: string;
  values: boolean[];
};

export default function TruthTableCard() {
  const [currentExpression, setCurrentExpression] = useState("");
  const [expressions, setExpressions] = useState<string[]>([]);
  const [results, setResults] = useState<ResultColumn[]>([]);
  const [variables, setVariables] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addExpression = async () => {
    if (currentExpression.trim() === "") return;

    console.log(variables);

    setIsLoading(true);
    const newExpressions = [...expressions, currentExpression];
    setExpressions(newExpressions);
    setCurrentExpression("");

    try {
      const data = await getTableTruthData(newExpressions);
      if (data) {
        const newVariables = Object.keys(data).filter(
          (key) => !newExpressions.includes(key)
        );
        setVariables(newVariables);

        const newResults: ResultColumn[] = [
          ...newVariables.map((v) => ({ expression: v, values: data[v] })),
          ...newExpressions.map((exp) => ({
            expression: exp,
            values: data[exp],
          })),
        ];
        setResults(newResults);
      }
    } catch (error) {
      console.error("Error generating truth table:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTable = () => {
    setExpressions([]);
    setResults([]);
    setVariables([]);
    setCurrentExpression("");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gerador de Tabela Verdade</CardTitle>
        <CardDescription>
          Insira expressões lógicas para gerar sua tabela verdade.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Insira a expressão lógica (exemplo: a & b)"
            value={currentExpression}
            onChange={(e) => setCurrentExpression(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addExpression();
              }
            }}
          />
          <Button
            className="bg-header-bg hover:bg-header-bg/90 text-soft-white"
            onClick={addExpression}
            disabled={isLoading}
          >
            {isLoading ? "Adicionando..." : "Adicionar"}
          </Button>
          <Button onClick={clearTable} variant="outline">
            Limpar
          </Button>
        </div>

        {results.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {results.map((column, index) => (
                  <TableHead key={index} className="text-center">
                    {column.expression}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results[0].values.map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {results.map((column, columnIndex) => (
                    <TableCell
                      key={`${columnIndex}-${rowIndex}`}
                      className="text-center"
                    >
                      {column.values[rowIndex] ? "V" : "F"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
