// ----------------------------------------------------
//          FUNÇÃO PARA CALCULAR O VENCEDOR
// ----------------------------------------------------
export function calcularVencedor(tabuleiro: (string | null)[]) {
  const linhasVencedoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let linha of linhasVencedoras) {
    const [a, b, c] = linha;

    if (
      tabuleiro[a] &&
      tabuleiro[a] === tabuleiro[b] &&
      tabuleiro[a] === tabuleiro[c]
    ) {
      return {
        jogador: tabuleiro[a],
        linha: linha,
      };
    }
  }

  return null;
}

// ----------------------------------------------------
//          FUNÇÃO PARA DETECTAR EMPATE
// ----------------------------------------------------
export function verificarEmpate(tabuleiro: (string | null)[]) {
  return tabuleiro.every((casa) => casa !== null);
}

// ----------------------------------------------------
//          TIPAGENS RELACIONADAS AO JOGO
// ----------------------------------------------------

export type PlayerSymbol = "X" | "O";
export type CellValue = PlayerSymbol | null;
export type GameStatus = "waiting" | "playing" | "finished";

// Estado completo do jogo
export type GameState = {
  board: CellValue[]; // tamanho 9
  turn: PlayerSymbol; // quem joga agora
  status: GameStatus; // status do jogo
  winner: PlayerSymbol | null; // vencedor, se houver
  winningLine: number[] | null; // linha vencedora, se houver
};

// Função para criar o estado inicial do jogo
export function createInitialGameState(): GameState {
  return {
    board: Array(9).fill(null),
    turn: "X",
    status: "playing",
    winner: null,
    winningLine: null,
  };
}

// Função para aplicar um movimento no estado do jogo
export function applyMove(state: GameState, indice: number, symbol: PlayerSymbol): GameState {

  // catches de segurança
  if (state.status !== "playing") return state;
  if (state.turn !== symbol) return state;
  if (indice < 0 || indice > 8) return state;
  if (state.board[indice]) return state;

  // cria nova configuração do tabuleiro
  const newBoard = [...state.board];
  newBoard[indice] = symbol;

  const resultado = calcularVencedor(newBoard);
  const winner = (resultado?.jogador ?? null) as PlayerSymbol | null; // garantir o tipo, o 'as' é necessário aqui porque TypeScript não consegue inferir sozinho
  const winningLine = resultado?.linha ?? null; // usar ?? significa que se resultado?.linha for undefined, winningLine será null
  const empate = !winner && verificarEmpate(newBoard);

  if (winner || empate) {
    return { ...state, board: newBoard, status: "finished", winner, winningLine };
  }

  const nextTurn: PlayerSymbol = symbol === "X" ? "O" : "X";
  return { ...state, board: newBoard, turn: nextTurn, winner: null, winningLine: null };
}

// = atribuição
// == igualdade (valor)
// === igualdade estrita (valor e tipo)
// != diferente
// a = 5  -> atribuição integer
// a == '5' -> true: porque só compara valor 
// a === '5' -> false: porque compara valor e tipo