import { createWebHistory, createRouter } from "vue-router";
import SignUp from "./pages/SignUp.vue";
import Onboarding from "./pages/Onboarding.vue";
import SignIn from "./pages/SignIn.vue";
import InitialSpeed from "./pages/InitialSpeed.vue";
import Tmap from "./pages/Tmap.vue";
import MyReport from "./pages/MyReport.vue";
import MyPage from "./pages/MyPage.vue";
import EditSpeed from "./pages/EditSpeed.vue";
import SearchResultPage from "./pages/SearchResultPage.vue";

const routes = [
    {
        path: "/",
        component: Onboarding,
        name: "Onboarding",
        meta: { hideBottomNav: true },
    },
    {
        path: "/login",
        component: SignIn,
        name: "SignIn",
        meta: { hideBottomNav: true },
    },
    {
        path: "/signup",
        component: SignUp,
        name: "SignUp",
        meta: { hideBottomNav: true },
    },
    {
        path: "/initial-speed",
        component: InitialSpeed,
        name: "InitialSpeed",
        meta: { hideBottomNav: true },
    },
    {
        path: "/home",
        component : Tmap,
        name: "Home",
        children: [
            {path: 'search', component: SearchResultPage, name: 'SearchResultPage', meta: { hideBottomNav: true }},
        ]
    },
    {
        path: "/my-report",
        component: MyReport,
        name: "MyReport",
    },
    {
        path: "/my-page",
        component: MyPage,
        name: "MyPage",
    },
    {
        path: "/edit-speed",
        component: EditSpeed,
        name: "EditSpeed",
        meta: { hideBottomNav: true },
    },
    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;