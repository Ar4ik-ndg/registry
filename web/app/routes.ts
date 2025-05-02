import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
    index("routes/role-redirect-page.tsx"),

    route("/auth", "pages/auth-page/auth-page.tsx"),

    layout("layouts/user-layout/user-layout.tsx", [
        route("main","pages/main-page/main-page.tsx"),
        route("account/:userId", "pages/account-page/account-page.tsx"),
        route("appointment/:userId/new", "pages/create-appointment-page/create-appointment-page.tsx"),
        route("appointment/:ticketId/update", "pages/update-appointment-page/update-appointment-page.tsx"),
    ]),

    ...prefix("admin", [
        index("routes/test.tsx"),
    ])

] satisfies RouteConfig;
