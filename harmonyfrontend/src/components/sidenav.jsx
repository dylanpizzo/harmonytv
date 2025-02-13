import React from "react";
import { Link } from "react-router-dom";
import model from "../model";
import { observer } from "mobx-react";

import "./sidenav.scss"

export default observer(class SideNav extends React.Component {
  state = {}

  componentDidMount() {
    model.library.refreshLibraries();
  }

  render() {
    const links = [];
    if (model.state.libraries) {
      for (const library of Object.values(model.state.libraries)) {
        const selected = window.location.href.indexOf("/" + library.id) !== -1;
        links.push(
          <Link key={library.id}
            className={selected ? "selected" : ""}
            to={"/library/" + library.id}
            onClick={() => {
              setImmediate(() => {
                this.forceUpdate();
              });
            }}
          >{library.name}</Link>
        )
      }
    }

    return (
      <div className="sidenav">
        <div className="sidenav-title">HarmonyTV</div>
        {links}
      </div>
    )
  }
});
