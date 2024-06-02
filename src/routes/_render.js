import { Router } from "express";
import { site } from "../config.js";
import readJSON from "../utils/readJSON.js";

const imports = readJSON("cms/_imports.json");

const router = Router();

// Setting constants for rendering
router.use((req, res, next) => {
    res.locals.global = site.global;
    res.locals.imports = imports[req.path];
    res.locals.__path = req.path;
    res.locals._date = new Date();

    res.locals.global.socials = res.locals.global.socials
        .filter(s => !s.hide);

    next();
});

// Prototype modification for response#render function
// This is to automatically render the layout view with a subview parameter
router.use((_, res, next) => {
    // Save the original render method
    const originalRender = res.render;

    // Override the render method
    res.render = function (view, options, callback) {
        // Check if the options object has a 'subView' property
        // If not, create a new options object with the subView property
        if (typeof options === "string") {
            options = { subView: options };
        } else if (options && !options.subView) {
            // If options exists but doesn't have a subView property, add it
            options.subView = view;
        }

        // Merge the layout and subView properties into the options object
        options = Object.assign({}, options, {
            layout: "layout",
            subView: options.subView,
        });

        // Call the original render method with the modified options
        originalRender.call(this, "layout", options, callback);
    };

    // Call the next middleware in the stack
    next();
});

export default router;
