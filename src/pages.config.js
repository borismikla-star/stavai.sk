import BrandHome from './pages/BrandHome';
import Strategy from './pages/Strategy';
import VisualIdentity from './pages/VisualIdentity';
import __Layout from './Layout.jsx';


export const PAGES = {
    "BrandHome": BrandHome,
    "Strategy": Strategy,
    "VisualIdentity": VisualIdentity,
}

export const pagesConfig = {
    mainPage: "BrandHome",
    Pages: PAGES,
    Layout: __Layout,
};