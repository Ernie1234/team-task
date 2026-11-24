import { Router } from "express";

import userRoute from "@/routes/user-route";
import { isAuthenticated } from "@/middlewares/isAuthenticatedMiddleware";
import workspaceRoute from "@/routes/workspace-route";
import membersRoute from "@/routes/member-route";
import projectsRoute from "@/routes/project-route";
import taskRoute from "@/routes/task-route";
import notificationRoute from "@/routes/notification-route";
import activitiesRoute from "@/routes/activities-route";
import chatRoute from "@/routes/chat-route";
import noteRoute from "@/routes/note-route";
import calendarRoute from "@/routes/calendar-route";
import emailRoute from "@/routes/email-route";

const apiRouter: Router = Router();

// Sign-in, sign-up and sessions are handled by Better Auth at /api/v1/auth (see index.ts)
// Unsubscribe links from emails (signed, no sign-in needed)
apiRouter.use("/email", emailRoute);
apiRouter.use("/user", isAuthenticated, userRoute);
apiRouter.use("/workspace", isAuthenticated, workspaceRoute);
apiRouter.use("/members", isAuthenticated, membersRoute);
apiRouter.use("/projects", isAuthenticated, projectsRoute);
apiRouter.use("/tasks", isAuthenticated, taskRoute);
apiRouter.use("/notifications", isAuthenticated, notificationRoute);
apiRouter.use("/activities", isAuthenticated, activitiesRoute);
apiRouter.use("/chat", chatRoute);
apiRouter.use("/notes", isAuthenticated, noteRoute);
apiRouter.use("/calendar", isAuthenticated, calendarRoute);

export default apiRouter;
