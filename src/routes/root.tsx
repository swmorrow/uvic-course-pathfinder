import "../App.css";

import { Suspense, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Course } from "../json/course";
import { CoursePostreqs } from "../json/course";
import _coursePostreqs from "../json/course-postreqs.json";
import { Metadata } from "../json/metadata";
import _metadata from "../json/metadata.json";

import List from "../components/list";

const coursePostreqs = _coursePostreqs as CoursePostreqs;
const metadata = {
  ..._metadata,
  scrapedAt: new Date(_metadata.scrapedAt),
} as Metadata;

export default function Root() {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.currentTarget.value.replace(/\s+/g, '').toUpperCase());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate('/courses/' + searchInput);
  };

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search" onSubmit={handleSubmit}>
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              onChange={handleSearch}
              value={searchInput}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={true}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </form>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <nav>
            <List input={searchInput}/>
          </nav>
        </Suspense>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <div id="detail">
          <Outlet />
        </div>
      </Suspense>
    </>
  );
  // return (
  //   <div className="App" role="main">
  //     <article className="App-article">
  //       <h1>React Search</h1>
  //       <input
  //         type="text"
  //         placeholder="Search here"
  //         onChange={handleSearch}
  //         value={searchInput} />
  //       <List input={searchInput}/>
  //     </article>
  //   </div>
  // );
}
