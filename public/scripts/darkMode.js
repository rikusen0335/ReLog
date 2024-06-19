// Reference: https://www.vidyasource.com/blog/dark-mode-nextjs-tailwindcss-react-hooks

const html = document.querySelector("html");

if (
	localStorage.getItem("theme") === "dark" ||
	(!("theme" in localStorage) &&
		window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
	html.classList.add("dark");
} else {
	html.classList.remove("dark");
}
