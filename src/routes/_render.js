import { Router } from "express";
import { site as config } from "../config.js";
import readJSON from "../utils/readJSON.js";

const imports = readJSON("cms/_imports.json");

const router = Router();

// Setting constants for render stuff
router.use((req, res, next) => {
  res.locals.global = config.global;
  res.locals.imports = imports[req.path];
  res.locals.__path = req.path;
  res.locals._date = new Date();
  next();
});

// Prototype modification for response#render function
// This is to automatically render the layout view with a subview parameter
router.use((_, res, next) => {
  // Save the original render method
  const originalRender = res.render;

  // Override the render method
  res.render = function (view, options, callback) {
    // Check if the options object has a 'sub_view' property
    // If not, create a new options object with the sub_view property
    if (typeof options === "string") {
      options = { sub_view: options };
    } else if (options && !options.sub_view) {
      // If options exists but doesn't have a sub_view property, add it
      options.sub_view = view;
    }

    // Merge the layout and sub_view properties into the options object
    options = Object.assign({}, options, {
      layout: "layout",
      sub_view: options.sub_view,
    });

    // Call the original render method with the modified options
    originalRender.call(this, "layout", options, callback);
  };

  // Call the next middleware in the stack
  next();
});

export default router;
