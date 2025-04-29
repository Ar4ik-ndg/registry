import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    layout("layouts/user-layout/user-layout.tsx", [
        index("pages/main-page/main-page.tsx"),
        route("account/:userId", "pages/account-page/account-page.tsx"),
        route("appointment/:userId/new", "pages/create-appointment-page/create-appointment-page.tsx"),
        route("test", "routes/test.tsx"),
    ])

] satisfies RouteConfig;
