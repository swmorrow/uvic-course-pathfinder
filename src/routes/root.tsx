import "../App.css";
import "../index.css";

import { Suspense, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import List from "../components/list";

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
        <nav>
          <List input={searchInput}/>
        </nav>
      </div>
      <div id="detail">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </>
  );
}
