import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AITools from './pages/AITools';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Dashboard": Dashboard,
    "AITools": AITools,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};