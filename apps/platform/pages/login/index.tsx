import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js';
import { encryptText, shakeElement } from '@repo/shared/anim';
import { wait } from '@repo/shared/clock';
import { $$ } from '@repo/shared/dom';
import { useNavigate } from '@solidjs/router';
import { BanIcon, CheckIcon, EyeClosedIcon, EyeIcon } from 'lucide-solid';
import z from 'zod';

import DiscordOAuthLink from '@/components/molescules/oauth-links/discord';
import GithubOAuthLink from '@/components/molescules/oauth-links/github';
import GoogleOAuthLink from '@/components/molescules/oauth-links/google';
import Spinner from '@/components/ui/spinner';
import { CookieKeys } from '@/lib/constants';
import { RequestError } from '@/lib/exceptions/fetch.exceptions';
import { cookies } from '@/lib/helpers/cookies';
import authService from '@/services/auth.service';

import styles from './index.module.css';

const Schema = z.object({
	identifier: z
		.string()
		// Must start and end with an alphanumeric character, and can contain dots, underscores, or hyphens in between. Consecutive dots, underscores, or hyphens are not allowed.
		// Valid: "john_doe", "john.doe", "john-doe", "john123"
		// Invalid: "_john", "john_", "john..doe", "john__doe", "john--doe", "john.-doe", "john-.doe"
		.regex(/^[a-zA-Z0-9](?:[._-](?![._-])|[a-zA-Z0-9]){1,28}[a-zA-Z0-9]$/, {
			error:
				'Username must start and end with a letter or number, and may contain dots, underscores, or hyphens (no consecutive symbols).',
		})
		.min(3)
		.max(30),
	password: z.string().min(8),
	'remember-me': z.enum(['on', 'off']).optional(),
});

const debounce = (fn: (...args: any[]) => void, delay = 300) => {
	let timeoutId: number | null = null;
	return (...args: unknown[]) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = window.setTimeout(() => {
			fn(...args);
			timeoutId = null;
		}, delay);
	};
};

const sanitizeHTML = (html: string) => {
	// Sanitizes HTML, allowing only <a> tags with safe attributes, strips all others.
	const template = document.createElement('template');
	template.innerHTML = html;

	const allowedTags = ['a'];
	const allowedAttrs = {
		a: ['href', 'target', 'rel'],
	};

	const sanitizeNode = (node: ChildNode): Node => {
		if (node.nodeType === Node.TEXT_NODE) {
			return document.createTextNode(node.textContent || '');
		}

		if (node.nodeType === Node.ELEMENT_NODE) {
			const element = node as HTMLElement;
			const tag = element.tagName.toLowerCase();

			if (allowedTags.includes(tag)) {
				const sanitized = document.createElement(tag);
				// Only allow safe attributes
				for (const attr of allowedAttrs[tag as keyof typeof allowedAttrs]) {
					if (element.hasAttribute(attr)) {
						let value = element.getAttribute(attr) || '';
						if (attr === 'href') {
							// Prevent javascript: and data: URIs
							if (/^\s*javascript:/i.test(value) || /^\s*data:/i.test(value)) {
								value = '#';
							}
						}
						sanitized.setAttribute(attr, value);
					}
				}
				// Always enforce safe link behavior
				sanitized.setAttribute('target', '_blank');
				sanitized.setAttribute('rel', 'noopener noreferrer');
				// Recursively sanitize children
				element.childNodes.forEach((child) => {
					sanitized.appendChild(sanitizeNode(child));
				});
				return sanitized;
			}
			// For all other tags, strip but keep their text content
			const fragment = document.createDocumentFragment();
			element.childNodes.forEach((child) => {
				fragment.appendChild(sanitizeNode(child));
			});
			return fragment;
		}

		return document.createTextNode('');
	};

	const sanitizedFragment = document.createDocumentFragment();
	template.content.childNodes.forEach((child) => {
		sanitizedFragment.appendChild(sanitizeNode(child));
	});

	const div = document.createElement('div');
	div.appendChild(sanitizedFragment);
	return div.innerHTML;
};

export default () => {
	const [passwordVisibility, setPasswordVisibility] = createSignal(false);
	const navigate = useNavigate();

	const authorized = cookies.get(CookieKeys.Session) !== undefined;

	if (authorized) {
		// You shouldn't be here if you're already logged in
		navigate('/-/home', { replace: true });
		return <></>;
	}

	const togglePasswordVisibility = () => {
		const prevValue = passwordVisibility();
		setPasswordVisibility(!prevValue);
	};

	// Typewriter effect
	createEffect(() => {
		const typewritter = $$<HTMLHeadingElement>('#typewriter');
		const cursor = $$<HTMLSpanElement>(`#cursor`);

		let currentPhraseIdx = 0;
		let currentPhrase = phrases[currentPhraseIdx];
		let currentCharIdx = 0;
		let isDeleting = false;
		let stopped = false;
		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		const typeLoop = async () => {
			if (stopped) return;

			if (cursor.dataset.stillTyping !== 'false') {
				cursor.dataset.stillTyping = 'false';
			}

			if (isDeleting) {
				currentCharIdx--;
				typewritter.textContent = currentPhrase.slice(0, currentCharIdx);

				if (currentCharIdx === 0) {
					isDeleting = false;
					currentPhraseIdx = (currentPhraseIdx + 1) % phrases.length;
					currentPhrase = phrases[currentPhraseIdx];
				}
			} else {
				currentCharIdx++;
				typewritter.textContent = currentPhrase.slice(0, currentCharIdx);

				if (currentCharIdx === currentPhrase.length) {
					isDeleting = true;

					cursor.dataset.stillTyping = 'true';
					await wait(3000); // Pause to read the full phrase
				}
			}

			if (!stopped) {
				timeoutId = setTimeout(typeLoop, 150);
			}
		};

		typeLoop();

		onCleanup(() => {
			stopped = true;
			if (timeoutId !== null) clearTimeout(timeoutId);
		});
	});

	// Bubble cursor effect (left side)
	createEffect(() => {
		const bubbleCursor = $$<HTMLSpanElement>('#bubble-cursor');
		const leftSide = $$<HTMLDivElement>('#left-side');

		// Keep track of current scale and translate
		let currentScale = 0;
		const currentTranslate = { x: 0, y: 0 };

		const updateTransform = () => {
			bubbleCursor.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${currentScale})`;
		};

		let isCursorInside = false;

		const onMouseLeave = () => {
			isCursorInside = false;
			// document.documentElement.style.cursor = 'default';
		};

		const onMouseEnter = () => {
			isCursorInside = true;
			// document.documentElement.style.cursor = 'none';
			bubbleCursor.style.height = '200px';
			bubbleCursor.style.width = '200px';
		};

		const FIXED_OFFSET = 30;

		const onMouseMove = (e: MouseEvent) => {
			const elementOnCursor = document.elementFromPoint(e.clientX, e.clientY);

			const isHeadingOrText =
				elementOnCursor &&
				[HTMLHeadingElement, HTMLParagraphElement, HTMLImageElement].some(
					(instance) => elementOnCursor instanceof instance
				);

			currentScale = isCursorInside ? (isHeadingOrText ? 0.25 : 1) : 0;

			const width = bubbleCursor.offsetWidth;
			const height = bubbleCursor.offsetHeight;

			currentTranslate.x = e.clientX - width / 2 - FIXED_OFFSET;
			currentTranslate.y = e.clientY - height / 2 - FIXED_OFFSET;

			updateTransform();
		};

		leftSide.addEventListener('mouseleave', onMouseLeave);
		leftSide.addEventListener('mouseenter', onMouseEnter);
		document.addEventListener('mousemove', onMouseMove);

		onCleanup(() => {
			leftSide.removeEventListener('mouseleave', onMouseLeave);
			leftSide.removeEventListener('mouseenter', onMouseEnter);
			document.removeEventListener('mousemove', onMouseMove);
		});
	});

	// Switch to sign-up page (encryption animation)
	createEffect(() => {
		const linkTag = $$<HTMLAnchorElement>('#redirect-link');
		const titleTag = $$<HTMLHeadingElement>('#title');
		const subtitleTag = $$<HTMLParagraphElement>('#subtitle');
		const submitTag = $$<HTMLButtonElement>('#submit');
		const formTag = $$<HTMLFormElement>('form');

		let currentIndex = 0;

		const onClick = (e: MouseEvent) => {
			e.preventDefault();

			currentIndex = (currentIndex + 1) % 2;
			const hashKey = Object.keys(hashTitles)[
				currentIndex
			] as keyof typeof hashTitles;

			formTag.dataset.type = hashKey.slice(1);

			encryptText(titleTag, hashTitles[hashKey], {
				tickDelay: 10,
				wait: 125,
			});
			encryptText(subtitleTag, hashSubtitles[hashKey], {
				// Subtitle has a longer text, so we give it more time to encrypt/decrypt for better effect
				tickDelay: 1,
				wait: 25,
			});
			encryptText(linkTag, hashLinks[hashKey], {
				tickDelay: 25,
				wait: 200,
			});
			encryptText(submitTag, hashButtonLabels[hashKey], {
				tickDelay: 40,
				wait: 250,
			});
		};

		linkTag.addEventListener('click', onClick);

		onCleanup(() => {
			linkTag.removeEventListener('click', onClick);
		});
	});

	// Check for oauth failures
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const error = urlParams.get('error');
		const errorCode = urlParams.get('error_code');
		const reason = urlParams.get('reason');
		const provider = urlParams.get('provider');

		if (error === 'oauth_failed') {
			setException({
				enabled: true,
				type: 'error',
				title: `OAuth Failed (${provider}: 0x${Number(errorCode).toString(16)})`,
				message: reason
					? `Reason: "${reason}". Please try again or <a href="mailto:support@dojoh.dev">connect us</a> if the problem persists.`
					: 'Please try again or <a href="mailto:support@dojoh.dev>connect us</a> if the problem persists.',
			});
		}
	});

	const [errors, setErrors] = createSignal<{ [key: string]: string }>({
		password: '',
		identifier: '',
	});

	const [submitting, setSubmitting] = createSignal(false);
	const [exception, setException] = createSignal({
		enabled: false,
		type: '' as 'error' | 'success' | 'info',
		title: '',
		message: '',
	});

	const handleSubmit = async (e: Event) => {
		e.preventDefault();

		setException((prev) => ({ ...prev, enabled: false }));

		const formData = new FormData(e.target as HTMLFormElement);
		const data = Object.fromEntries(formData.entries());

		const validation = Schema.safeParse(data);

		if (!validation.success) {
			// update
			const button = $$<HTMLButtonElement>('#submit');

			const zodErrors = z.treeifyError(validation.error);

			setErrors({
				identifier: zodErrors.properties?.identifier?.errors[0] || '',
				password: zodErrors.properties?.password?.errors[0] || '',
			});

			// render
			shakeElement(button);
			return;
		}

		setErrors({
			identifier: '',
			password: '',
		});

		const formType =
			e.target instanceof HTMLFormElement && e.target.dataset.type;

		setSubmitting(true);

		try {
			if (formType === 'sign-up') {
				const randomInt = Math.floor(Math.random() * 1_000_000).toString();

				await authService.signUp({
					...validation.data,
					nickname: validation.data.identifier,
					// We require an email for sign-up, but since we allow using nickname/email for login,
					// we can just create a fake email using the identifier
					email: `${validation.data.identifier}+${randomInt}@local.dev`,
				});
			}

			await authService.logIn({
				identifier: validation.data.identifier,
				password: validation.data.password,
				rememberMe: validation.data['remember-me'] === 'on',
			});

			navigate('/-/home');
		} catch (e) {
			const err = e as Error;
			// Handle login error (e.g., show error message)

			if (err instanceof RequestError) {
				setException({
					enabled: true,
					type: 'error',
					title: (err.response as { error?: string })?.error || 'Login failed',
					message:
						'Please check your credentials and try again, if the problem persists, ' +
						`<a href = "mailto:support@dojoh.dev">contact support</a>.`,
				});
			}

			const button = $$<HTMLButtonElement>('#submit');
			shakeElement(button);
		} finally {
			setSubmitting(false);
		}
	};

	const debouncedValidate = debounce((name: string, value: string) => {
		const validation = Schema.safeParse({ [name]: value });
		const zodErrors = z.treeifyError(validation.error!);

		const key = name as 'identifier' | 'password';

		setErrors((prev) => ({
			...prev,
			[key]: zodErrors.properties?.[key]?.errors[0] || '',
		}));
	}, 300);

	const handleChange = (name: string) => (e: Event) => {
		const value = (e.target as HTMLInputElement).value;

		debouncedValidate(name, value);
	};

	return (
		<section class={styles.container}>
			<div id="left-side" class={styles.leftSide}>
				<span id="bubble-cursor" class={styles.bubbleCursor}></span>

				<span id="logo" class={styles.logo}>
					<img src="/rounded.png" alt="logo" width="24" height="24" />
					<h1>
						dojoh<p>.dev</p>
					</h1>
				</span>

				<span class={styles.text}>
					<div class={styles.typewriterContainer}>
						<h2 id="typewriter" class={styles.typewriter}>
							{/* Typewriter text will be injected here by the effect */}
						</h2>
						<span
							id="cursor"
							class={styles.cursor}
							data-still-typing="false"
						></span>
					</div>

					<p>
						Enter fast-paced 1v1 coding matches, solve problems live, and rise
						through the ranks against developers from all around the world.
					</p>
				</span>

				<video autoplay muted loop playsinline>
					<source src="/black-waves.mp4" type="video/mp4" />
				</video>
			</div>

			<div class={styles.rightSide}>
				<h1 id="title">{hashTitles[hashKey] || ''}</h1>
				<p id="subtitle">{hashSubtitles[hashKey] || ''}</p>

				<form
					id="auth-form"
					data-type={hashKey.slice(1)}
					on:submit={handleSubmit}
				>
					{exception().enabled && (
						<div
							role="alert"
							class={styles.exception}
							data-type={exception().type}
						>
							<span>
								<BanIcon size={16} color="hsl(0deg 89.19% 59.86%)" />
								<b>{exception().title}</b>
							</span>
							<p innerHTML={sanitizeHTML(exception().message)}></p>
						</div>
					)}

					<div class={styles.inputGroup}>
						<label for="identifier">Username</label>
						<div>
							<input
								type="text"
								id="identifier"
								name="identifier"
								placeholder="johndoe"
								aria-invalid={errors().identifier ? 'true' : 'false'}
								autocomplete="username"
								on:input={handleChange('identifier')}
							/>
						</div>
						{errors().identifier && (
							<label for="identifier" role="alert">
								{errors().identifier}
							</label>
						)}
					</div>

					<div class={styles.inputGroup}>
						<label for="password">Password</label>
						<div>
							<input
								type={passwordVisibility() ? 'text' : 'password'}
								id="password"
								name="password"
								placeholder="• • • • • • • • • • • •"
								aria-invalid={errors().password ? 'true' : 'false'}
								autocomplete="current-password"
								on:input={handleChange('password')}
							/>
							<span
								id="toggle-password-visibility"
								data-append
								aria-label="Toggle password visibility"
								on:click={togglePasswordVisibility}
							>
								<Show
									when={passwordVisibility()}
									fallback={<EyeIcon size={16} color="#7F7F7F" />}
								>
									<EyeClosedIcon size={16} color="#7F7F7F" />
								</Show>
							</span>
						</div>
						{errors().password && (
							<label for="password" role="alert">
								{errors().password}
							</label>
						)}
					</div>

					<div class={styles.options}>
						<div>
							<input type="checkbox" id="remember-me" name="remember-me" />
							<span class={styles.checkmark}>
								<CheckIcon size={10} color="#fff" stroke-width={4} />
							</span>
							<label for="remember-me">Remember me</label>
						</div>
						<a href="/forgot-password">Forgot password?</a>
					</div>

					<button
						id="submit"
						type="submit"
						aria-loading={submitting() ? 'true' : 'false'}
						disabled={submitting()}
					>
						<Show
							when={submitting()}
							fallback={hashButtonLabels[hashKey] || ''}
						>
							<Spinner />
						</Show>
					</button>
				</form>

				<span class={styles.or}></span>

				<div class={styles.stackY}>
					<GoogleOAuthLink />
					<GithubOAuthLink />
					<DiscordOAuthLink />
				</div>

				<p class={styles.signUpPrompt}>
					Ready to prove your skills?&nbsp;
					<a id="redirect-link" href="#redirect-up" title="Create account">
						{hashLinks[hashKey] || ''}
					</a>
				</p>
			</div>
		</section>
	);
};

const hashTitles = {
	'#log-in': 'Welcome back to the dojoh.',
	'#sign-up': 'Let’s get you set up for battle.',
};

const hashSubtitles = {
	'#log-in':
		'Compete live against developers from around the world and prove what you’re capable of.',
	'#sign-up':
		'Create your account to join live coding battles, climb the leaderboard, and challenge high quality devs.',
};

const hashLinks = {
	'#log-in': 'Join the battle',
	'#sign-up': 'Back to login',
};

const hashButtonLabels = {
	'#log-in': 'Get in',
	'#sign-up': 'Join',
};

const hashKey = (window.location.hash || '#log-in') as keyof typeof hashTitles;

const phrases = [
	'Can you be faster than your opponent?',
	'The dojoh is waiting for you.',
	'Could you keep the pace?',
	'Can you outcode your opponent?',
	'Think faster. Build smarter. Win harder.',
	'Can you handle the pressure?',
	'Your next rival is already waiting.',
	'Coding has never been this competitive.',
	'Battle for the top spot.',
	'Face the most competitive developers around the globe.',
];
