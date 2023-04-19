import { useParams } from "react-router-dom";

import Flow from "../components/flow";

export default function CourseFlow() {
  const { courseName } = useParams()

  if (courseName === undefined) {
    return <div>
      Search for a course to see its postreqs!
    </div>
  }

  return (
    <div>
      <Flow courseName={courseName}/>
    </div>
  )
}