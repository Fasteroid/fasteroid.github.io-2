import { Link } from 'preact-router/match';
import style from './style.module.css';
import { link } from './../../absPath'

// TODO: use tech from prerender to auto-populate this
export function Header() {
	return (
		<header class={style.header}>
			<a href="/" class={style.logo}>
				<img src="../../assets/preact-logo-inverse.svg" alt="Preact Logo" height="32" width="32" />
				<h1>Fast's Code Creations <b><i>2</i></b></h1>
			</a>
			<nav>
				<Link activeClassName={style.active} href={link("")}>
					Home
				</Link>
			</nav>
		</header>
	)
}
