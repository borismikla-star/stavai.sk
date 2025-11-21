import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AITools from './pages/AITools';
import CostEstimator from './pages/CostEstimator';
import Projects from './pages/Projects';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Dashboard": Dashboard,
    "AITools": AITools,
    "CostEstimator": CostEstimator,
    "Projects": Projects,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};