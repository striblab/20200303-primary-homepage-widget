import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		'title': 'Star Tribune primary homepage widget'
	}
});

window.app = app;

export default app;
