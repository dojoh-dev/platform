import z from 'zod';
import { CheckIcon, EyeClosedIcon, EyeIcon } from 'lucide-solid';
import { createEffect, createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { encryptText, shakeElement } from '@repo/shared/anim';
import { $$ } from '@repo/shared/dom';
import { wait } from '@repo/shared/clock';

import GoogleOAuthLink from '@/components/molescules/oauth-links/google';
import GithubOAuthLink from '@/components/molescules/oauth-links/github';
import DiscordOAuthLink from '@/components/molescules/oauth-links/discord';
import Spinner from '@/components/ui/spinner';
import { cookies } from '@/lib/helpers/cookies';
import { CookieKeys } from '@/lib/constants';
import authService from '@/services/auth.service';

import styles from './index.module.css';

const Schema = z.object({
  identifier: z
    .string()
    // Must start and end with an alphanumeric character, and can contain dots, underscores, or hyphens in between. Consecutive dots, underscores, or hyphens are not allowed.
    // Valid: "john_doe", "john.doe", "john-doe", "john123"
    // Invalid: "_john", "john_", "john..doe", "john__doe", "john--doe", "john.-doe", "john-.doe"
    .regex(/^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){1,14}[a-zA-Z0-9]$/, {
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

export default () => {
  const [passwordVisibility, setPasswordVisibility] = createSignal(false);
  const navigate = useNavigate();

  const authorized = cookies.get(CookieKeys.Session) !== undefined;

  if (authorized) {
    // You shouldn't be here if you're already logged in
    navigate('/-/home', { replace: true });
  }

  const togglePasswordVisibility = () => {
    const prevValue = passwordVisibility();
    setPasswordVisibility(!prevValue);
  };

  // Typewriter effect
  createEffect(() => {
    const typewritter = $$<HTMLHeadingElement>('#typewriter');
    const cursor = $$<HTMLSpanElement>(`#cursor`);

    const phrases = [
      'Face another developer in a live coding duel.',
      'One problem. Two programmers. One winner.',
      'Compete head-to-head in real-time code battles.',
      'Your next opponent is already in the queue.',
      'Think quickly. Code precisely.',
      'Skill decides the outcome.',
      'Win rounds. Earn rank. Climb higher.',
      'Every match is a new challenge.',
      'Outcode your opponent before time runs out.',
      'Sharpen your problem-solving under pressure.',
      'Fast solutions beat perfect intentions.',
      'Match against developers around the world.',
      'Prove your skills one battle at a time.',
      'Live coding. Instant results.',
      'Battle for position on the leaderboard.',
      'Precision matters when the clock is running.',
      'Rank up through pure coding skill.',
      'A true test of speed and logic.',
      'Compete, improve, repeat.',
      'Real-time coding battles start here.',
      'Victory belongs to the faster mind.',
      'Every second counts in the arena.',
      'Solve first. Claim the win.',
      'Train your instincts against real opponents.',
      'Challenge developers at your level and beyond.',
      'Code under pressure. Perform with confidence.',
      'Your ranking reflects your consistency.',
      'Quick thinking wins difficult battles.',
      'Queue up and enter the arena.',
      'Welcome to competitive programming in real time.',
    ];

    let currentPhraseIdx = 0;
    let currentPhrase = phrases[currentPhraseIdx];
    let currentCharIdx = 0;
    let isDeleting = false;

    const typeLoop = async () => {
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

      setTimeout(typeLoop, 150);
    };

    typeLoop();
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

    leftSide.addEventListener('mouseleave', () => {
      isCursorInside = false;
      document.documentElement.style.cursor = 'default';
    });

    leftSide.addEventListener('mouseenter', () => {
      isCursorInside = true;
      document.documentElement.style.cursor = 'none';
      bubbleCursor.style.height = '200px';
      bubbleCursor.style.width = '200px';
    });

    const FIXED_OFFSET = 20;

    document.addEventListener('mousemove', (e) => {
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

    linkTag.addEventListener('click', (e) => {
      e.preventDefault();

      currentIndex = (currentIndex + 1) % 2;
      const hashKey = Object.keys(hashTitles)[
        currentIndex
      ] as keyof typeof hashTitles;

      formTag.dataset.type = hashKey.slice(1);

      encryptText(titleTag, hashTitles[hashKey], {
        tickDelay: 25,
        wait: 200,
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
        tickDelay: 25,
        wait: 200,
      });
    });
  });

  const [errors, setErrors] = createSignal<{ [key: string]: string }>({
    password: '',
    identifier: '',
  });

  const [submitting, setSubmitting] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

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
        ...validation.data,
        rememberMe: validation.data['remember-me'] === 'on',
      });

      navigate('/-/home');
    } catch (e) {
      const err = e as Error;
      // Handle login error (e.g., show error message)
      alert('Sign-up or login failed: ' + err.message);
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus
            nec fringilla accumsan.
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
  '#log-in': 'Welcome back!',
  '#sign-up': 'Join the battle',
};

const hashSubtitles = {
  '#log-in':
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation',
  '#sign-up':
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis',
};

const hashLinks = {
  '#log-in': 'Join the battle',
  '#sign-up': 'Back to login',
};

const hashButtonLabels = {
  '#log-in': 'Login',
  '#sign-up': 'Sign Up',
};

const hashKey = (window.location.hash || '#log-in') as keyof typeof hashTitles;
