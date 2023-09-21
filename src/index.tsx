import { Route, Router } from 'preact-router';

import { Header } from './components/header';

// Code-splitting is automated for `routes` directory
import Home from './routes';

import './style/index.css';
import { link } from './absPath';

// TODO: use tech from prerender to auto-populate this
export default function App() {
    return (
        <div id="app">
            <Header />
			<main>
				<Router>
					<Route path={link("")} component={Home} />
				</Router>
			</main>
        </div>
    );
}
