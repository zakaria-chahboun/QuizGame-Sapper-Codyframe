import sirv from "sirv";
import express from "express";
import compression from "compression";
import * as sapper from "@sapper/server";

import { json } from "body-parser";
//import csurfMiddleware from "csurf";
import cookieParser from "cookie-parser";
import { SessionAuthentication } from "./tools/authentication";
import { api_v1_core_router } from "./api/v1/core";
import { api_v1_user_router } from "./api/v1/user";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

// Polka or Express
express()
  // - body parser
  .use(json())
  // - cookies parser
  .use(cookieParser())
  // - csurf cookie
  // .use(
  //   csurfMiddleware({
  //     cookie: true,
  //   })
  // )
  // - to avoid csurf attacks
  // .all("*", (req, res, next) => {
  //   res.cookie("XSRF-TOKEN", req.csrfToken());
  //   next();
  // })
  .use("/api/v1", api_v1_core_router)
  .use("/api/v1", SessionAuthentication, api_v1_user_router)
  // -- for easy use & to not show the "api/v1/user/logout" in the href attribute in the button
  .get("/logout", (req, res, next) => {
    res.redirect("api/v1/user/logout");
  })
  .use(
    compression({
      threshold: 0,
    }),
    sirv("static", {
      dev,
    }),
    SessionAuthentication,
    sapper.middleware({
      session: (req, res) => ({
        user: req.user,
      }),
    })
  )
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });
