import { lazy } from "react";
import { useParams } from "react-router-dom";

const LayoutFlow = lazy(() => import("../components/layoutflow"));

import { Node, Edge } from 'reactflow';

import { Course } from '../json/course';
import { CoursePostreqs } from "../json/course";
import _coursePostreqs from "../json/course-postreqs.json";

const allCoursePostreqs = _coursePostreqs as CoursePostreqs;
const MAX_NODES = 100;

function getNodesEdges(postreqs: Course[], courseName: string, nodes: Node[], edges: Edge[]) {
  if (postreqs === undefined || postreqs.length == 0 || nodes.length >= MAX_NODES) {
    return;
  }

  // Push postreqs as nodes onto nodes list
  postreqs.map((postreq: Course) => nodes.push({
      id:         postreq.subject + postreq.code,
      position:   {x: 0, y: 0},
      data:       {label: postreq.subject + postreq.code + ": " + postreq.title},
      // parentNode: courseName,
    }));

  // Add the edges for said nodes
  postreqs.map((postreq: Course) => edges.push({
    id:     courseName + '-' + postreq.subject + postreq.code,
    source: courseName,
    target: postreq.subject + postreq.code,
  }));

  // Recursively do the same for all the postreqs of the course
  postreqs.map((postreq: Course) => getNodesEdges(
    allCoursePostreqs[postreq.subject + postreq.code],
    postreq.subject + postreq.code,
    nodes,
    edges,
  ));
}

export default function CourseFlow() {
  const { courseName } = useParams()

  if (courseName === undefined) {
    return <div>
      Search for a course to see its postreqs!
    </div>
  }

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
  }];

  const initialEdges: Edge[] = [];

  // Recursively populate the nodes and edges
  getNodesEdges(postreqs, courseName, initialNodes, initialEdges);

  return (
    <div>
      <LayoutFlow courseName={courseName} initialNodes={initialNodes} initialEdges={initialEdges}/>
    </div>
  )
}