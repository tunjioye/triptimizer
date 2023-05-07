import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

// import { MdNightlightRound, MdWbSunny } from 'react-icons/md'
// import { auth, toggleDarkMode } from '@/store/page'

function Header() {
  // const { isDarkMode } = auth.use()
  const { pathname } = useRouter()

  return (
    <header className="container">
      <title>Triptimizer</title>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <strong>Triptimizer</strong>
            </Link>
          </li>
        </ul>

        <ul>
          <li className={clsx({ active: pathname === '/' })}>
            <Link href="/">Home</Link>
          </li>
          <li className={clsx({ active: pathname === '/about' })}>
            <Link href="/about">About</Link>
          </li>
          <li className={clsx({ active: pathname === '/contact' })}>
            <Link href="/contact">Contact</Link>
          </li>

          {/* <li>
            <button
              id="theme-toggle"
              type="button"
              className="theme-toggle-button"
              data-theme-switcher="light"
              onClick={toggleDarkMode}
            >
              <MdNightlightRound fill="black" className={clsx({ hidden: isDarkMode })} id="theme-toggle-dark-icon" />
              <MdWbSunny fill="white" className={clsx({ hidden: !isDarkMode })} id="theme-toggle-light-icon" />
            </button>
          </li> */}
        </ul>
      </nav>
    </header>
  )
}

export default Header
