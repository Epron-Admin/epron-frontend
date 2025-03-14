import React from "react";

function Footer() {
  const date = new Date()
  const year = date.getFullYear()
  return (
    <footer className="bg-green-900 text-center text-white py-3 text-sm">
      <p>EPRON</p>
      <p>Copyright &copy; {year}</p>
    </footer>
  );
}

export default Footer;
