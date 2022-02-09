import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion, DataType }from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import { render } from "enzyme";


// var updatedAccessToken = "";
// var globalShopVariale = "";
// const gamoogaScript = `<!-- START GAMOOGA BASE SCRIPT -->
// <script type="text/javascript">
//     var _taq = {"id":"57ff22ef-4cd0-41fd-9815-dc4161032afa","events":[],"identify":[],"property":[], "handlers":[]};
//     (function() {
//         var ta = document.createElement('script'); ta.type = 'text/javascript'; ta.async = true; ta.id = "__ta";
//         ta.src = '//cdn-jp.gsecondscreen.com/static/ta.min.js';
//         var fs = document.getElementsByTagName('script')[0]; fs.parentNode.insertBefore(ta, fs);
//     })();
// </script>
// <!-- END GAMOOGA BASE SCRIPT -->`;

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  console.log("reloading the page--------------------------------------------------------------------------------");
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // console.log("ctx--------------------------------------------------------------------------------------------", ctx);
        // console.log("ctx state--------------------------------------------------------------------------------------------", ctx.state);
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        // globalShopVariale = shop;
        // updatedAccessToken = accessToken
        // console.log("accessToken--------------------------------------------------------------------------",accessToken);
        // console.log("updatedAccessToken-------------------------------------------------------------------",updatedAccessToken);
        // console.log("shop------------------------------------------------------------------------------------", shop)
        // const client_themes = new Shopify.Clients.Rest(`${shop}`, updatedAccessToken);
        // const data_themes = await client_themes.get({
        //   path: 'themes',
        // });

        // const themeId = data_themes.body.themes[0].id;

        // const client_assets = new Shopify.Clients.Rest(`${shop}`, updatedAccessToken);
        // const data_assets = await client_assets.get({
        //   path: `themes/${themeId}/assets`,
        //   query: {"asset[key]":"layout/theme.liquid"},
        // });

        // if(data_assets.body.asset.value.indexOf('_taq') === -1) {
        //   const value = data_assets.body.asset.value;
        //   data_assets.body.asset.value = `${value}\n\n${gamoogaScript}`;
            
        //   const data_asset = await client_assets.put({
        //   path: `themes/${themeId}/assets`,
        //   data: data_assets.body,
        //   type: DataType.JSON
        // });
        // }

        // console.log("data----------------------", data_assets.body)
        
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/webhooks", async (ctx) => {
    try {
      // console.log("updated Access Token----------------------------------------------",updatedAccessToken);
      // console.log("globalshopvariable-------------------------------------------------", globalShopVariale);
      //   const client_themes = new Shopify.Clients.Rest(`${globalShopVariale}`, updatedAccessToken);
      //   const data_themes = await client_themes.get({
      //     path: 'themes',
      //   });

      // const themeId = data_themes.body.themes[0].id;
      // console.log("themeID---------------------------------",themeId);

      // const client_assets = new Shopify.Clients.Rest(`${shop}`, updatedAccessToken);
      // const data_assets = await client_assets.get({
      //   path: `themes/${themeId}/assets`,
      //   query: {"asset[key]":"layout/theme.liquid"},
      // });

      // if(data_assets.body.asset.value.indexOf('_taq') != -1) {
      //   const gamoogaStartingIndex = data_assets.body.asset.value.indexOf("<!-- START GAMOOGA BASE SCRIPT -->");
      //   const updatedValue = data_assets.body.asset.value.substring(gamoogaStartingIndex, -1);
      //   data_assets.body.asset.value = updatedValue;
      // }

      // const data_asset = await client_assets.put({
      //   path: `themes/${themeId}/assets`,
      //   data: data_assets.body,
      //   type: DataType.JSON
      // });
      // console.log("removed the gamooga script");
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  // router.get("/", ()=> {
  //   console.log("hello world");
  // })

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      console.log("in the graphql post method--------------------------------------------------------------");
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      console.log("great");
      ctx.body = "hello world";
    //  ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
