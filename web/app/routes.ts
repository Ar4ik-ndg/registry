import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
    index("routes/role-redirect/role-redirect.tsx"),

    route("/auth", "pages/auth-page/auth-page.tsx"),

    layout("layouts/user-layout/user-layout.tsx", [
        route("main","pages/main-page/main-page.tsx"),
        route("account/:userId", "pages/account-page/account-page.tsx"),
        route("appointment/:userId/new", "pages/create-appointment-page/create-appointment-page.tsx"),
    ]),

    ...prefix("med", [
        layout("layouts/staff-layout/staff-layout.tsx", [
            index("pages/staff-page/staff-page.tsx"),
            route("appointments/registry","pages/confirmation-appointments-page/confirmation-appointments-page.tsx"),
            route("appointment/new", "pages/create-appointment-staff-page/create-appointment-staff-page.tsx"),
            route("appointments/daily", "pages/appointments-daily-page/appointments-daily-page.tsx")
        ]),
    ]),

    ...prefix("admin", [
        layout("layouts/admin-layout/admin-layout.tsx", [
            index("routes/test.tsx"),
            route("all-tickets", "pages/admin-page/admin-page.tsx"),

        ]),
    ])

] satisfies RouteConfig;
