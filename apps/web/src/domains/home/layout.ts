import styles from './layout.module.css';

export default function () {
	return /*html*/ `
		<header class="${styles.header}">
			<span>
				<img src="/rounded.png" alt="logo" width="24" height="24" />
				<h1>dojoh<span>.dev</span></h1>
			</span>

			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/community">Community</a></li>
				<li><a href="/challenges/29">Platform</a></li>
				<li><a href="/about">About</a></li>
				<li><a href="/docs">Docs</a></li>
			</ul>

			<span>
				<a
					role="button"
					variant="outline"
					href="/login#access"
				>
						Login
				</a>
				<a
					role="button"
					variant="solid"
					href="/login#create"
				>
						Get started
				</a>
			</span>
		</header>
		<main class="${styles.main}">
			<x-outlet></x-outlet>
		</main>
	`;
}
