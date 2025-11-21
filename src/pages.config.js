import BrandHome from './pages/BrandHome';
import Strategy from './pages/Strategy';
import VisualIdentity from './pages/VisualIdentity';
import Messaging from './pages/Messaging';
import Ecosystem from './pages/Ecosystem';
import Guidelines from './pages/Guidelines';
import Home from './pages/Home';
import __Layout from './Layout.jsx';


export const PAGES = {
    "BrandHome": BrandHome,
    "Strategy": Strategy,
    "VisualIdentity": VisualIdentity,
    "Messaging": Messaging,
    "Ecosystem": Ecosystem,
    "Guidelines": Guidelines,
    "Home": Home,
}

export const pagesConfig = {
    mainPage: "BrandHome",
    Pages: PAGES,
    Layout: __Layout,
};