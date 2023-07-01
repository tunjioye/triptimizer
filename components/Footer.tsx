import React from 'react'
import { FaEnvelope } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="container">
      <nav>
        <ul>
          <li>&copy; 2023 Triptimizer</li>
        </ul>
        <ul className="hide-on-print">
          <li>
            <a href="mailto:" target="_blank" rel="noreferrer">
              <FaEnvelope />
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  )
}

export default Footer
