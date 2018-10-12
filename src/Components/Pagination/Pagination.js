import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './Pagination.css';

class Pagination extends Component {
  render() {
    let renderPages;

    if (this.props.count && this.props.limit) {
      const pages = Math.ceil(this.props.count / this.props.limit);
      let pageArray = [];
      let i;

      for (i = 0; i < pages; i++) {
        pageArray.push(i + 1);
      }

      if (pageArray) {
        renderPages = pageArray.map(page => {
          return (
            <li key={page}>
              <NavLink to={`${this.props.link}${page}`}>{page}</NavLink>
            </li>
          );
        });
      }
    }

    // For debugging
    // console.log(this.props.limit, this.props.count, Math.ceil(this.props.count / this.props.limit))

    return (
      <div>
        <ul className="Pagination">{renderPages}</ul>
      </div>
    );
  }
}

export default Pagination;
