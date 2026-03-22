import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  type Connection,
  type Edge,
  type Node,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchFlow, saveFlow } from "../api";

function toRFNodes(
  raw: { id: string; type: string; position: { x: number; y: number }; data: { label: string } }[]
): Node[] {
  return raw.map((n) => ({
    id: n.id,
    type: "default",
    position: n.position,
    data: { label: n.data.label },
    style: {
      background: "#1e293b",
      color: "#e2e8f0",
      border: "1px solid #475569",
      borderRadius: 8,
      padding: 10,
      fontSize: 12,
    },
  }));
}

function toRFEdges(raw: { id: string; source: string; target: string }[]): Edge[] {
  return raw.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    style: { stroke: "#64748b" },
  }));
}

export default function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [name, setName] = useState("Default pipeline");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchFlow()
      .then((f) => {
        setName(f.name);
        setNodes(toRFNodes(f.nodes));
        setEdges(toRFEdges(f.edges));
      })
      .catch((e) => setStatus(String(e)));
  }, [setEdges, setNodes]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, style: { stroke: "#94a3b8" } } as Edge, eds)),
    [setEdges]
  );

  const flowKey = useMemo(() => JSON.stringify({ n: nodes.length, e: edges.length }), [nodes.length, edges.length]);

  async function handleSave() {
    setStatus("Saving…");
    try {
      const payload = {
        name,
        nodes: nodes.map((n) => ({
          id: n.id,
          type: n.type ?? "default",
          position: n.position,
          data: { label: String(n.data.label ?? n.id) },
        })),
        edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
      };
      await saveFlow(payload);
      setStatus("Saved.");
    } catch (e) {
      setStatus(String(e));
    }
  }

  return (
    <div className="flex flex-col gap-3 h-[min(70vh,560px)]">
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="bg-slate-900 border border-slate-600 rounded px-3 py-1.5 text-sm flex-1 min-w-[200px]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Flow name"
        />
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm font-semibold"
        >
          Save flow to backend
        </button>
        <span className="text-xs text-slate-500">{status}</span>
      </div>
      <div className="flex-1 rounded-xl border border-slate-700 overflow-hidden bg-slate-900/50" key={flowKey}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-slate-950"
        >
          <MiniMap className="!bg-slate-800" />
          <Controls className="!bg-slate-800 !border-slate-600" />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#334155" />
        </ReactFlow>
      </div>
      <p className="text-xs text-slate-500">
        Drag nodes, connect handles, add edges. This is your Flow Builder canvas (React Flow). Save persists to the
        API (<code className="text-slate-400">backend/data/state.json</code>).
      </p>
    </div>
  );
}
