import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    layout("layouts/user-layout/user-layout.tsx", [
        index("routes/home.tsx"),
        route("account", "routes/account.tsx"),
        route("test", "routes/test.tsx"),
    ])

] satisfies RouteConfig;
