import "./App.css";
import logo from "./logo.svg";

import { useState } from "react";

import { Course } from "./json/course";
import { CoursePostreqs } from "./json/course";
import _coursePostreqs from "./json/course-postreqs.json";
import { Metadata } from "./json/metadata";
import _metadata from "./json/metadata.json";

import SearchBar from './components/searchBar';
import List from "./components/list";

const coursePostreqs = _coursePostreqs as CoursePostreqs;
const metadata = {
  ..._metadata,
  scrapedAt: new Date(_metadata.scrapedAt),
} as Metadata;

function App() {
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.currentTarget.value.toUpperCase());
  };

  return (
    <div className="App" role="main">
      <article className="App-article">
        <h1>React Search</h1>
        <input
          type="text"
          placeholder="Search here"
          onChange={handleChange}
          value={searchInput} />
        <List input={searchInput}/>
      </article>
    </div>
  );
}

export default App;
