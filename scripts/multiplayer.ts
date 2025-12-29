import { auth, db } from "@/firebase";
import { signInAnonymously } from "firebase/auth";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

export async function ensureAnonAuth() {
  // já tem usuário logado?
  if (auth.currentUser) return auth.currentUser;

  // faz login anônimo
  const cred = await signInAnonymously(auth);
  return cred.user;
}

// ----------------------------------------------------
//          FUNÇÃO PARA CRIAR SALA DE JOGO
// ----------------------------------------------------

type RoomDoc = {
  board: ( "X" | "O" | null )[];
  turn: "X" | "O";
  status: "waiting" | "playing" | "finished";
  winner: "X" | "O" | null;
  winningLine: number[] | null;
  players: {
    X: { uid: string };
    O: { uid: string } | null;
  };
  createdAt: any;
  updatedAt: any;
};

// Cria uma nova sala de jogo e retorna o ID da sala
export async function createRoom(): Promise<{ roomId: string }> {
  const user = await ensureAnonAuth();

  const roomsRef = collection(db, "rooms");
  const roomRef = doc(roomsRef); // gera id automaticamente
  const roomId = roomRef.id;

  const room: RoomDoc = {
    board: Array(9).fill(null),
    turn: "X",
    status: "waiting",
    winner: null,
    winningLine: null,
    players: { X: { uid: user.uid }, O: null },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(roomRef, room);
  return { roomId };
}
