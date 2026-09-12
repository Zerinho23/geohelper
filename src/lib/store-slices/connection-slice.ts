import type { StateCreator } from "zustand"

import type { ConnState, Round, Snapshot } from "@/types"
import type { Store } from "@/lib/store"

export type ConnectionSlice = {
  conn: ConnState
  /** Last disconnect reason. Stays sticky across `searching` retries so the UI
   * doesn't flicker between "Connecting..." and the actual error every loop. */
  lastDisconnectReason: string | null
  history: Round[]
  setSnapshot: (snapshot: Snapshot) => void
  setConn: (conn: ConnState) => void
}

function stickyReason(prev: string | null, next: ConnState): string | null {
  if (next.kind === "disconnected") return next.reason
  if (next.kind === "connected") return null
  return prev
}

export const createConnectionSlice: StateCreator<Store, [], [], ConnectionSlice> = (set) => ({
  conn: { kind: "idle" },
  lastDisconnectReason: null,
  history: [],
  setSnapshot: (snapshot) =>
    set((s) => {
      const keepCurrentMock = s.current?.source === "mock" && !snapshot.current
      return {
        conn: snapshot.conn,
        history: snapshot.history,
        current: keepCurrentMock ? s.current : snapshot.current,
        lastDisconnectReason: stickyReason(s.lastDisconnectReason, snapshot.conn),
      }
    }),
  setConn: (conn) =>
    set((s) => ({
      conn,
      lastDisconnectReason: stickyReason(s.lastDisconnectReason, conn),
    })),
})
