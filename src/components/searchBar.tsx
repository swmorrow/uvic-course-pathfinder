import { ReactNode, useState } from 'react';
import { CoursePostreqs } from "../json/course";
import _coursePostreqs from "../json/course-postreqs.json";

const searchBar = (): JSX.Element => {
  const [searchInput, setSearchInput] = useState("");

  const coursePostreqs = _coursePostreqs as CoursePostreqs;

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.currentTarget.value);
  };

  if (searchInput.length > 0) {
    Object.keys(coursePostreqs).filter((course) => {
    return course.match(searchInput);
  });}

  return <div>

  {/* <input
    type="text"
    placeholder="Search here"
    onChange={handleChange}
    value={searchInput} />

  <table>
  <tr>
    <th>Course</th>
  </tr>

  {Object.keys(coursePostreqs).map((course: string, index: number): ReactNode => {
  return <div>
    <tr>
      <td>{course}</td>
    </tr>
  </div>

  })}
  </table> */}
    
  </div>
}

export default searchBar;
