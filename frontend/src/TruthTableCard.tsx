"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const getTableTruthData = async (expression: string) => {
  try {
    const url = "http://localhost:3000/tables/truth"
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expression,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro:", error)
  }
}

type ResultColumn = {
  expression: string
  values: boolean[]
}

export default function TruthTableCard() {
  const [expression, setExpression] = useState("")
  const [results, setResults] = useState<ResultColumn[]>([])
  const [variables, setVariables] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const generateTruthTable = async () => {
    setIsLoading(true)
    try {
      const data = await getTableTruthData(expression)
      const newVariables = Object.keys(data).slice(0, -1)
      const newColumn: ResultColumn = {
        expression: expression,
        values: data[Object.keys(data).slice(-1)[0]],
      }
      
      if (results.length === 0) {
        setVariables(newVariables)
        setResults([
          ...newVariables.map(v => ({ expression: v, values: data[v] })),
          newColumn
        ])
      } else {
        setResults([...results, newColumn])
      }
    } catch (error) {
      console.error("Error generating truth table:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearTable = () => {
    setResults([])
    setVariables([])
  }

  return (
    <Card className="w-full">
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
          <Button onClick={clearTable} variant="outline">
            Limpar
          </Button>
        </div>

        {results.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {variables.map((variable) => (
                  <TableHead key={variable} className="text-center">{variable}</TableHead>
                ))}
                {results.slice(variables.length).map((result, index) => (
                  <TableHead key={index} className="text-center">{result.expression}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results[0].values.map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {results.map((column, columnIndex) => (
                    <TableCell key={`${columnIndex}-${rowIndex}`} className="text-center">
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
  )
}