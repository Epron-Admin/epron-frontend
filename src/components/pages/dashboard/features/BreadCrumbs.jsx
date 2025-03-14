import React from "react";
import { Link } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";

function BreadCrumbs() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <div className="text-sm mt-3 mb-5 p-side py-3 pb-3 border-b">
      {breadcrumbs.map(({ breadcrumb, key }, index) => (
        <span key={index} className={`${index >= breadcrumbs.length - 1 ? "text-green-600" : ""}`}>
          <Link to={key}>{breadcrumb}</Link>
          {index < breadcrumbs.length - 1 && <span className="mx-2">{">"}</span>}
        </span>
      ))}
    </div>
  );
}

export default BreadCrumbs;
