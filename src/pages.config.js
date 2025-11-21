import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AITools from './pages/AITools';
import CostEstimator from './pages/CostEstimator';
import Projects from './pages/Projects';
import TimelineGenerator from './pages/TimelineGenerator';
import FeasibilityAnalyzer from './pages/FeasibilityAnalyzer';
import ProjectCreate from './pages/ProjectCreate';
import ProjectDetail from './pages/ProjectDetail';
import Knowledge from './pages/Knowledge';
import Estivo from './pages/Estivo';
import About from './pages/About';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Dashboard": Dashboard,
    "AITools": AITools,
    "CostEstimator": CostEstimator,
    "Projects": Projects,
    "TimelineGenerator": TimelineGenerator,
    "FeasibilityAnalyzer": FeasibilityAnalyzer,
    "ProjectCreate": ProjectCreate,
    "ProjectDetail": ProjectDetail,
    "Knowledge": Knowledge,
    "Estivo": Estivo,
    "About": About,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};