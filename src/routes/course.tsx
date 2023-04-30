import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from "react-router-dom";

import ReactFlow from 'reactflow';
import { Node, Edge, Position, useNodesState, useEdgesState, ConnectionLineType, Controls, MiniMap, Background, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';

import dagre from 'dagre';

import '../index.css'

import CourseNode from '../components/coursenode';

import { Course }         from '../json/course';
import { CoursePostreqs } from "../json/course";
import _coursePostreqs    from "../json/course-postreqs.json";

import { CourseData } from "../json/course";
import _courseData    from "../json/course-data.json";

const allCoursePostreqs = _coursePostreqs as CoursePostreqs;
const    courseData     =   _courseData   as unknown as CourseData;

const MAX_NODES     = 750;
const NODES_WARNING = 200;

const NODE_WIDTH  = 200;
const NODE_HEIGHT = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left  : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - NODE_WIDTH  / 2,
      y: nodeWithPosition.y - NODE_HEIGHT / 2,
    };

    return node;
  });

  return { nodes, edges };
};

// abomination function signature
function populateNodesEdges(postreqs: Course[], courseName: string, nodes: Node[], edges: Edge[], coveredCourses: { [key: string]: boolean | undefined }, maxLayers: number, currentLayer: number) {
  if (postreqs === undefined || postreqs.length == 0 || nodes.length >= MAX_NODES || !(coveredCourses[courseName] === undefined) || currentLayer > maxLayers) {
    return;
  }

  // TODO: Prevent duplicate edges (I think they come from courses where it is both a pre- and co-requisite? Not sure.)
  //       Some duplicates include MATH122-MATH322, MATH211-MATH379, MATH211-MATH322, MATH211-CSC205.
  postreqs.map((postreq: Course) => {
    nodes.push({
      id:          postreq.subject + postreq.code,
      position:    {x: 0, y: 0},
      type:        "courseNode",
      data:        {label: postreq.subject + postreq.code, title: postreq.title, pid: postreq.pid},
      connectable: false,
      deletable:   false,
    });

    edges.push({
      id:     courseName + '-' + postreq.subject + postreq.code,
      source: courseName,
      target: postreq.subject + postreq.code,
    });

    coveredCourses[courseName] = true;

    populateNodesEdges(
      allCoursePostreqs[postreq.subject + postreq.code],
      postreq.subject + postreq.code,
      nodes,
      edges,
      coveredCourses,
      maxLayers,
      currentLayer + 1
    );
  });
}

function getNodesEdges(courseName: string, maxLayers: string) {
  const postreqs = allCoursePostreqs[courseName];

  if (maxLayers.length === 0) { maxLayers = "1"; }

  const initialNodes: Node[] = [{
    id:       courseName,
    type:     "courseNode",
    position: {x: 0, y: 0},
    data:     {label: courseName, title: courseData[courseName].title, pid: courseData[courseName].pid},
    connectable: false,
    deletable:   false,
  }];

  const initialEdges: Edge[] = [];

  // Recursively populate the nodes and edges
  populateNodesEdges(postreqs, courseName, initialNodes, initialEdges, {}, Number(maxLayers), 1);

  // Then layout them
  return getLayoutedElements(
    initialNodes,
    initialEdges
  );
}

export default function LayoutFlow() {
  const { courseName } = useParams();

  if (courseName === undefined) {
    return <div>
      Please enter a valid course name.
    </div>
  }

  if (!(courseName in allCoursePostreqs)) {
    return <div>
      {courseName} is not a prerequisite for any course.
    </div>
  }

  const [maxLayers, setNumLayers] = useState("")

  const { nodes: layoutedNodes, edges: layoutedEdges } = getNodesEdges(courseName, maxLayers);

  const nodeTypes = useMemo(() => ({ courseNode: CourseNode }), []);

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

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getNodesEdges(courseName, maxLayers);
    console.log(maxLayers);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [courseName, maxLayers]);

  return (
    <div className="layoutflow" style={{ width: '100%', height: '91vh' }}>
      {courseName} Course Pathway
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.Bezier}
        fitView>
          <Controls />
          <MiniMap zoomable pannable />
          <Background  color="#ccc" variant={BackgroundVariant.Dots} />
        </ReactFlow>
      <div className="controls">
        <div>{nodes.length >= MAX_NODES ? "Max num. nodes exceeded! Some course paths may end prematurely." : (nodes.length >= NODES_WARNING ? "Warning: high node count! Graph may be difficult to read (as you can probably see)" : "")}</div>
        <input
          placeholder="Num. Layers (default 1)"
          type="number"
          pattern="[1-9]"
          value={maxLayers}
          onChange={(e) =>
            setNumLayers((v) => (e.target.validity.valid ? e.target.value : v))
          }
        />
        <button onClick={() => onLayout('TB')}>vertical layout</button>
        <button onClick={() => onLayout('LR')}>horizontal layout</button>
      </div>
    </div>
  );
}