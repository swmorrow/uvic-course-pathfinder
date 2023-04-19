import ReactFlow, { Node, Edge, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

import { Course } from '../json/course';
import { CoursePostreqs } from "../json/course";
import _coursePostreqs from "../json/course-postreqs.json";
import { useCallback, useState } from 'react';

const allCoursePostreqs = _coursePostreqs as CoursePostreqs;

function getNodesEdges(postreqs: Course[], courseName: string, nodes: Node[], edges: Edge[], xOffset: number, yOffset: number) {
  if (postreqs === undefined || postreqs.length == 0) {
    return;
  }

  // Push postreqs as nodes onto nodes list
  postreqs.map((postreq: Course, arrayPosition: number) => nodes.push({
      id:         postreq.subject + postreq.code,
      position:   {x: xOffset-200*(arrayPosition - postreqs.length/2), y: yOffset},
      data:       {label: postreq.subject + postreq.code + ": " + postreq.title},
      parentNode: courseName,
    }));

  // Add the edges for said nodes
  postreqs.map((postreq: Course) => edges.push({
    id:     courseName + '-' + postreq.subject + postreq.code,
    source: courseName,
    target: postreq.subject + postreq.code
  }));

  // Recursively do the same for all the postreqs of the course
  postreqs.map((postreq: Course, arrayPosition: number) => getNodesEdges(
    allCoursePostreqs[postreq.subject + postreq.code],
    postreq.subject + postreq.code,
    nodes,
    edges,
    xOffset-150*(arrayPosition - postreqs.length/2),
    yOffset+100+100*(arrayPosition - postreqs.length/2)
  ));
}

export default function Flow(props: { courseName: string }) {
  const { courseName } = props;

  if (!(courseName in allCoursePostreqs)) {
    return <div>
      {courseName} is not a prerequisite for any course.
    </div>
  }

  const postreqs = allCoursePostreqs[courseName];

  const initialNodes: Node[] = [{
    id:       courseName,
    position: {x: 0, y: 0},
    data:     {label: courseName},
  },];
  
  const initialEdges: Edge[] = [];
  
  // Recursively populate the nodes and edges
  getNodesEdges(postreqs, courseName, initialNodes, initialEdges, 0, 100);

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((els) => applyNodeChanges(changes, els)),
    []
  );

  const handleChange = (e: any) => {
    e.target.value
  };
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      Here is the course pathway for {courseName}!
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange}/>
    </div>
  );
}