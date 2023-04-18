import { useState } from 'react'
import { CoursePostreqs } from "../json/course";
import _coursePostreqs from "../json/course-postreqs.json";

const coursePostreqs = _coursePostreqs as CoursePostreqs;

function List(props: any): JSX.Element {
  const filteredData = Object.keys(coursePostreqs).filter((el) => {
    //if no input the return the original
    if (props.input === '') {
      return el;
    }
    //return the item which contains the user input
    else {
      return el.toUpperCase().includes(props.input)
    }
  })

  return (
    <table>
      <tr>
        <th>Course</th>
        <th>Postreqs</th> 
      </tr>
        {filteredData.map((courseName) => (
          <tr>
            <td>{courseName}</td>
            <td>{coursePostreqs[courseName].map((postreq) => {
              return <ul>
                {postreq.subject + postreq.code + ": " + postreq.title}
              </ul>
            })}
            </td>
          </tr>
        ))}
    </table>
  )
}

export default List