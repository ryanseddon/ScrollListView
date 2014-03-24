macro import {
    rule {
        { $modules (,) ... } from $module:lit;
    } => {
        $(var $modules = require($module).$modules;) ...
    }
}

export import;
