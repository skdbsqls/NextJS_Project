import Link from "next/link";
import Image from "next/image";

import logoImg from "@/assets/logo.png";
import classes from "./main-header.module.css";
import MainHeaderBackGround from "./main-header-background";
import NavLink from "./nav-link";

export default function MainHeader() {
  return (
    <>
      <MainHeaderBackGround />
      <header className={classes.header}>
        <Link className={classes.logo} href="/">
          <Image src={logoImg} aria-label="A plate with food on it" property />
          NextLevel Food
        </Link>
        <nav className={classes.nav}>
          <ul>
            <li>
              <NavLink href="/meals">Browse Meals</NavLink>
            </li>
            <li>
              <NavLink href="/community">Foodies Community</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
