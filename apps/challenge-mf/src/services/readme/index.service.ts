export default class Readme {
	public static transform(markdown: string): string {
		if (!markdown) return '';

		// Normalize line endings
		markdown = markdown.replace(/\r\n/g, '\n');

		// Escape HTML first
		markdown = Readme.escapeHTML(markdown);

		// Block code ``` ```
		markdown = markdown.replace(
			/```(\w+)?\n([\s\S]*?)```/g,
			(_, lang, code) => Readme.blockCode(code.trim(), lang || '')
		);

		// Headings
		markdown = markdown.replace(/^###### (.*)$/gm, (_, t) => Readme.h6(t));
		markdown = markdown.replace(/^##### (.*)$/gm, (_, t) => Readme.h5(t));
		markdown = markdown.replace(/^#### (.*)$/gm, (_, t) => Readme.h4(t));
		markdown = markdown.replace(/^### (.*)$/gm, (_, t) => Readme.h3(t));
		markdown = markdown.replace(/^## (.*)$/gm, (_, t) => Readme.h2(t));
		markdown = markdown.replace(/^# (.*)$/gm, (_, t) => Readme.h1(t));

		// Horizontal rule
		markdown = markdown.replace(/^---$/gm, Readme.hr());

		// Blockquotes
		markdown = markdown.replace(/^> (.*)$/gm, (_, t) =>
			Readme.blockquote(t)
		);

		// Task list
		markdown = markdown.replace(/^- \[x\] (.*)$/gim, (_, t) =>
			Readme.taskListItem(t, true)
		);
		markdown = markdown.replace(/^- \[ \] (.*)$/gim, (_, t) =>
			Readme.taskListItem(t, false)
		);

		// Unordered list
		markdown = markdown.replace(/^- (.*)$/gm, (_, t) => Readme.list(t));
		markdown = markdown.replace(/^\* (.*)$/gm, (_, t) => Readme.list(t));

		// Ordered list
		markdown = markdown.replace(/^\d+\. (.*)$/gm, (_, t) => Readme.list(t));

		// Wrap consecutive <li> in <ul>
		markdown = markdown.replace(
			/(<li>.*<\/li>\n?)+/g,
			(match) => `<ul>\n${match.trim()}\n</ul>\n`
		);

		// Tables
		markdown = Readme.parseTables(markdown);

		// Inline code
		markdown = markdown.replace(/`([^`]+)`/g, (_, t) => Readme.code(t));

		// Bold / Italic / Strike
		markdown = markdown.replace(/\*\*\*(.*?)\*\*\*/g, (_, t) =>
			Readme.boldItalic(t)
		);
		markdown = markdown.replace(/\*\*(.*?)\*\*/g, (_, t) => Readme.bold(t));
		markdown = markdown.replace(/\*(.*?)\*/g, (_, t) => Readme.italic(t));
		markdown = markdown.replace(/~~(.*?)~~/g, (_, t) =>
			Readme.strikethrough(t)
		);

		// Images
		markdown = markdown.replace(
			/!\[([^\]]*)\]\(([^)]+)\)/g,
			(_, alt, url) => Readme.image(alt, url)
		);

		// Links
		markdown = markdown.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			(_, text, url) => Readme.link(text, url)
		);

		// Paragraphs (wrap loose lines)
		markdown = markdown.replace(
			/^(?!<h\d|<ul>|<ol>|<li>|<pre>|<blockquote>|<table>|<hr)(.+)$/gm,
			(_, t) => Readme.p(t)
		);

		return markdown;
	}

	private static escapeHTML(input: string): string {
		return input
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	private static parseTables(markdown: string): string {
		const tableRegex = /((?:\|.*\|\n)+)/g;

		return markdown.replace(tableRegex, (block) => {
			const lines = block.trim().split('\n');
			if (lines.length < 2) return block;

			const headers = lines[0]
				.split('|')
				.filter(Boolean)
				.map((h) => h.trim());

			const rows = lines.slice(2).map((line) =>
				line
					.split('|')
					.filter(Boolean)
					.map((cell) => cell.trim())
			);

			return this.table(headers, rows);
		});
	}

	public static h1(input: string) {
		return `<h1>${input}</h1>`;
	}
	public static h2(input: string) {
		return `<h2>${input}</h2>`;
	}
	public static h3(input: string) {
		return `<h3>${input}</h3>`;
	}
	public static h4(input: string) {
		return `<h4>${input}</h4>`;
	}
	public static h5(input: string) {
		return `<h5>${input}</h5>`;
	}
	public static h6(input: string) {
		return `<h6>${input}</h6>`;
	}

	public static p(input: string) {
		return `<p>${input}</p>`;
	}

	public static bold(input: string) {
		return `<strong>${input}</strong>`;
	}
	public static italic(input: string) {
		return `<em>${input}</em>`;
	}
	public static boldItalic(input: string) {
		return `<strong><em>${input}</em></strong>`;
	}
	public static strikethrough(input: string) {
		return `<del>${input}</del>`;
	}

	public static code(input: string) {
		return `<code>${input}</code>`;
	}

	public static blockCode(input: string, language: string = '') {
		return `<pre><code class="${language}">${input}</code></pre>`;
	}

	public static list(input: string) {
		return `<li>${input}</li>`;
	}

	public static link(text: string, url: string, title: string = '') {
		const titleAttr = title ? ` title="${title}"` : '';
		return `<a href="${url}"${titleAttr}>${text}</a>`;
	}

	public static image(alt: string, url: string, title: string = '') {
		const titleAttr = title ? ` title="${title}"` : '';
		return `<img src="${url}" alt="${alt}"${titleAttr} />`;
	}

	public static blockquote(input: string) {
		return `<blockquote>${input}</blockquote>`;
	}

	public static hr() {
		return `<hr />`;
	}

	public static table(headers: string[], rows: string[][]) {
		const head = headers.map((h) => `<th>${h}</th>`).join('');
		const body = rows
			.map(
				(row) => `<tr>${row.map((c) => `<td>${c}</td>`).join('')}</tr>`
			)
			.join('\n');

		return `<table>
<thead><tr>${head}</tr></thead>
<tbody>
${body}
</tbody>
</table>`;
	}

	public static taskListItem(input: string, checked = false) {
		const checkedAttr = checked ? ' checked' : '';
		return `<li><input type="checkbox"${checkedAttr} disabled /> ${input}</li>`;
	}
}
