import { Link } from "react-router-dom";

import { Course } from "../json/course";
import _courseCatalog from "../json/course-catalog.json";

const courseCatalog = _courseCatalog as Course[];

export default function List(props: any): JSX.Element {
  const filteredData = courseCatalog.filter((course: Course) => {
    // if no input, return the original
    if (props.input === '') {
      return course;
    }
    
    // return the item which contains the user input
    return (course.subject + course.code).includes(props.input);
  });

  return (
    <ul>
      {filteredData.map((course) => {[]
        return <li key={course.subject + course.code}>
          <Link to={"courses/" + course.subject + course.code}>{course.subject + course.code + ": " + course.title}</Link>
        </li>;
      })}
    </ul>
  );

  // return (
  //   <table>
  //     <tr>
  //       <th>Course</th>
  //       <th>Postreqs</th> 
  //     </tr>
  //       {filteredData.map((courseName) => (
  //         <tr>
  //           {/* <td><Button text={courseName} setFlow={setFlow}/></td> */}
  //           <td><button onClick={() => setFlow(courseName)}>{courseName}</button></td>
  //           <td>{coursePostreqs[courseName].map((postreq) => {
  //             return <ul>
  //               {postreq.subject + postreq.code + ": " + postreq.title}
  //             </ul>
  //           })}
  //           </td>
  //         </tr>
  //       ))}
  //   </table>
  // );
}