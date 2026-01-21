import AITools from './pages/AITools';
import About from './pages/About';
import BuildingAnalyzer from './pages/BuildingAnalyzer';
import CaseStudies from './pages/CaseStudies';
import ComparisonCalculator from './pages/ComparisonCalculator';
import CostEstimator from './pages/CostEstimator';
import Dashboard from './pages/Dashboard';
import Estivo from './pages/Estivo';
import FeasibilityAnalyzer from './pages/FeasibilityAnalyzer';
import Home from './pages/Home';
import Knowledge from './pages/Knowledge';
import ProjectCreate from './pages/ProjectCreate';
import ProjectDetail from './pages/ProjectDetail';
import Projects from './pages/Projects';
import QuickROI from './pages/QuickROI';
import TimelineGenerator from './pages/TimelineGenerator';
import MarketIntelligence from './pages/MarketIntelligence';
import DocumentGenerator from './pages/DocumentGenerator';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AITools": AITools,
    "About": About,
    "BuildingAnalyzer": BuildingAnalyzer,
    "CaseStudies": CaseStudies,
    "ComparisonCalculator": ComparisonCalculator,
    "CostEstimator": CostEstimator,
    "Dashboard": Dashboard,
    "Estivo": Estivo,
    "FeasibilityAnalyzer": FeasibilityAnalyzer,
    "Home": Home,
    "Knowledge": Knowledge,
    "ProjectCreate": ProjectCreate,
    "ProjectDetail": ProjectDetail,
    "Projects": Projects,
    "QuickROI": QuickROI,
    "TimelineGenerator": TimelineGenerator,
    "MarketIntelligence": MarketIntelligence,
    "DocumentGenerator": DocumentGenerator,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};