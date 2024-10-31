#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

typedef enum {
    AND,
    OR,
    NOT,
    XOR,
    IMPLIES,
    INVALID_OPERATOR
} Operator;

typedef struct {
    Operator op;
    int qtdRepr;
    const char* representations[3];
} OperatorMapping;


const OperatorMapping operatorMappings[] = {
    {AND, 2, {"AND", "&"}},
    {OR, 2, {"OR", "|"}},
    {NOT, 3, {"NOT", "!", "~"}},
    {XOR, 2, {"XOR", "^"}},
    {IMPLIES, 3, {"IMPLIES", "->", "=>"}},
};

#define MAX_OPERANDS 4

typedef struct Operation {
    Operator operator;
    int operandNumber;
    struct Operation* operations[MAX_OPERANDS];
    int boolean;
    int isBoolean;
} Operation;

Operation* createBooleanOperation(int boolean);
Operation* createOperation(Operator operator, int operandNumber);
Operator parseOperator(const char** expr);
Operation* parseOperand(const char** expr);
Operation* parseExpression(const char** expr);
void printOperation(Operation* op);
void freeOperation(Operation* op);

int resolveExpression(Operation *op);
int resolveOperand(Operator operator, int operandNumber, int values[operandNumber]);
int resolveAndOperand(int operandNumber, int values[MAX_OPERANDS]);
int resolveOrOperand(int operandNumber, int values[MAX_OPERANDS]);
int resolveNotOperand(int operandNumber, int values[MAX_OPERANDS]);
int resolveXorOperand(int operandNumber, int values[MAX_OPERANDS]);
int resolveImpliesOperand(int operandNumber, int values[MAX_OPERANDS]);
void error(const char* msg);

int main(int argc, char *argv[]) {
    const char* expression = argv[1];
    Operation* root = parseExpression(&expression);

    printf("Parsed Expression: ");
    printOperation(root);
    printf("\n");

    int result = resolveExpression(root);
    printf("Expression Result: %d", result);
    printf("\n");

    freeOperation(root);

    return 0;
}

Operation* createBooleanOperation(int boolean) {
    Operation* op = (Operation*)malloc(sizeof(Operation));
    op->isBoolean = 1;
    op->boolean = boolean;   
    for (int i = 0; i < MAX_OPERANDS; i++) {
        op->operations[i] = NULL;
    }
    return op;
}

Operation* createOperation(Operator operator, int operandNumber) {
    Operation* op = (Operation*)malloc(sizeof(Operation));
    op->operator = operator;
    op->operandNumber = operandNumber;
    op->isBoolean = 0;
    for (int i = 0; i < MAX_OPERANDS; i++) {
        op->operations[i] = NULL;
    }
    return op;
}

Operator parseOperator(const char** expr) {
    while (isspace(**expr)) (*expr)++;

    int qtdOperators = sizeof(operatorMappings) / sizeof(OperatorMapping);

    for (int i = 0; i < qtdOperators; i++) {
        const char** reps = operatorMappings[i].representations;
        for (int j = 0; j < operatorMappings[i].qtdRepr; j++) {
            size_t len = strlen(reps[j]);
            if (strncmp(*expr, reps[j], len) == 0) {
                *expr += len;
                return operatorMappings[i].op;
            }
        }
    }

    return INVALID_OPERATOR;
}

Operation* parseOperand(const char** expr) {
    while (isspace(**expr)) (*expr)++;

    Operator op = parseOperator(expr);
    if (op == NOT) {
        Operation* operand = parseOperand(expr);
        Operation* notOp = createOperation(NOT, 1);
        notOp->operations[0] = operand;
        return notOp;
    } else if (op != INVALID_OPERATOR) {
        error("Expected an operand, but found an operator.");
    }

    if (**expr == '(') {
        (*expr)++;
        Operation* op = parseExpression(expr);
        if (**expr == ')') (*expr)++;
        return op;
    } else if (isalpha(**expr)) {
        int boolean = (**expr == 'T') ? 1 : 0;
        Operation* op = createBooleanOperation(boolean);
        (*expr)++;
        return op;
    }
    return NULL;
}

Operation* parseExpression(const char** expr) {
    Operation* left = parseOperand(expr);

    while (**expr != '\0' && **expr != ')') {
        Operator op = parseOperator(expr);
        Operation* right = parseOperand(expr);

        Operation* newOp = createOperation(op, 2);
        newOp->operations[0] = left;
        newOp->operations[1] = right;
        left = newOp;  // A nova operação é o novo "esquerdo"
    }
    return left;
}

void printOperation(Operation* op) {
    if (op->isBoolean) {
        printf("%s", op->boolean ? "T" : "F");
        return;
    }

    if (op->operator == NOT) {
        printf("(~");
        if (op->operations[0]) printOperation(op->operations[0]);
         printf(")");
        return;
    }

    printf("(");
    if (op->operations[0]) printOperation(op->operations[0]);

    switch (op->operator) {
        case AND: printf(" & "); break;
        case OR: printf(" | "); break;
        case XOR: printf(" ^ "); break;
        case IMPLIES: printf(" -> "); break;
    }

    if (op->operations[1]) printOperation(op->operations[1]);
    printf(")");
}

void freeOperation(Operation* op) {
    if (op) {
        for (int i = 0; i < MAX_OPERANDS; i++) {
            freeOperation(op->operations[i]);
        }
        free(op);
    }
}

int resolveExpression(Operation *op) {
    if (op->isBoolean == 1) {
        return op->boolean;
    }

    int values[op->operandNumber]; 
    for (int i = 0; i < op->operandNumber; i++) {
        values[i] = resolveExpression(op->operations[i]);
    }

    return resolveOperand(op->operator, op->operandNumber, values);
}

int resolveOperand(Operator operator, int operandNumber, int values[operandNumber]) {
    switch (operator) {
        case AND: return resolveAndOperand(operandNumber, values); break;
        case OR:return resolveOrOperand(operandNumber, values); break;
        case NOT: return resolveNotOperand(operandNumber, values); break;
        case XOR: return resolveXorOperand(operandNumber, values); break;
        case IMPLIES: return resolveImpliesOperand(operandNumber, values); break;
        default: 
            fprintf(stderr, "Error: Unsupported operator %d\n", operator); 
            return 0;
    }
}

int resolveAndOperand(int operandNumber, int values[MAX_OPERANDS]) {
    int result = 1;
    for (int i = 0; i < operandNumber; i++) {
        result &= values[i];
    }
    return result;
}

int resolveOrOperand(int operandNumber, int values[MAX_OPERANDS]) {
    int result = 0;
    for (int i = 0; i < operandNumber; i++) {
        result |= values[i];
    }
    return result;
}

int resolveNotOperand(int operandNumber, int values[MAX_OPERANDS]) {
    if (operandNumber != 1) {
        error("Not operator requires exactly 1 operand.\n");
    }

    return !values[0];
}

int resolveXorOperand(int operandNumber, int values[MAX_OPERANDS]) {
    int result = 0;
    for (int i = 0; i < operandNumber; i++) {
        result ^= values[i];
    }
    return result;
}

int resolveImpliesOperand(int operandNumber, int values[MAX_OPERANDS]) {
    if (operandNumber != 2) {
        error("Implies operator requires exactly 2 operand.\n");
    }

    return !values[0] || values[1];
}

void error(const char* msg) {
    fprintf(stderr, "%s\n", msg);
    exit(EXIT_FAILURE);
}
