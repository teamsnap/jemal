import React from 'react';
import { NavLink } from 'react-router-dom';

import './Pagination.css';

const Pagination = ({ count, limit, link }) => {
  let pageArray = [];

  if (count && limit) {
    const pages = Math.ceil(count / limit);

    let i;

    for (i = 0; i < pages; i++) {
      pageArray.push(i + 1);
    }
  }

  return (
    <ul className="Pagination">
      {pageArray &&
        pageArray.map(page => (
          <li key={page}>
            <NavLink to={`${link}${page}`}>{page}</NavLink>
          </li>
        ))}
    </ul>
  );
};

export default Pagination;
