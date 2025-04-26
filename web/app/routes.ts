import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("account", "routes/account.tsx"),
] satisfies RouteConfig;
