import ReactFlow, { Node, Edge, Position, useNodesState, useEdgesState, ConnectionLineType, Controls, MiniMap, Background, BackgroundVariant } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

import '../index.css'

import { useCallback, useState } from 'react';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node, i) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export default function LayoutFlow(props: { courseName: string, initialNodes: Node[], initialEdges: Edge[] }) {
  const { courseName, initialNodes, initialEdges } = props;

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  
  const onLayout = useCallback(
    (direction: string) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

  // const [nodes, setNodes] = useState(initialNodes);
  // const [edges, setEdges] = useState(initialEdges);

  // const onNodesChange = useCallback( (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes] );
  // const onEdgesChange = useCallback( (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges] );
  
  return (
    <div className="layoutflow" style={{ width: '100%', height: '91vh' }}>
      {courseName} Course Pathway
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineType={ConnectionLineType.Bezier}
        fitView>
          <Controls />
          <MiniMap zoomable pannable />
          <Background  color="#ccc" variant={BackgroundVariant.Dots} />
        </ReactFlow>
      <div className="controls">
        <button onClick={() => onLayout('TB')}>vertical layout</button>
        <button onClick={() => onLayout('LR')}>horizontal layout</button>
      </div>
    </div>
  );
}