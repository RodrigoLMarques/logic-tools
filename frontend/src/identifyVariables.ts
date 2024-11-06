const operatorMappings = [
  { operator: "AND", precedence: 2, symbols: ["AND", "&"] },
  { operator: "OR", precedence: 2, symbols: ["OR", "|"] },
  { operator: "NOT", precedence: 3, symbols: ["NOT", "!", "~"] },
  { operator: "XOR", precedence: 2, symbols: ["XOR", "^"] },
  { operator: "IMPLIES", precedence: 3, symbols: ["IMPLIES", "->", "=>"] },
];

const operators = operatorMappings.flatMap(mapping => mapping.symbols);

export function identifyVariables(expression: string) {
  const operatorRegex = new RegExp(`\\s*(${operators.map(op => op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\s*`, 'g');
  
  const tokens = expression.split(operatorRegex).filter(token => token.trim() !== '');

  const variables = new Set();
  const transformedExpression = tokens.map(token => {
    if (!operators.includes(token)) {
      variables.add(token);
      return `{${token}}`;
    }
    return token;
  }).join(" ");

  return [transformedExpression, Array.from(variables)];
}