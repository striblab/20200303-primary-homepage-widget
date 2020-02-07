import App from './App.svelte';
import './scss/style.scss';

const app = new App({
	target: document.body,
	props: {
		'title': 'Star Tribune primary homepage widget'
	}
});

window.app = app;

export default app;
