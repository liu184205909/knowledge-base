'use strict';

module.exports = function blockLegacyStepZero(scriptPath) {
  throw new Error(
    `Retired T17 Step-0 script: ${scriptPath}. It targets the obsolete t17_add_custom_bracelet flow and must not run against production or staging. Use the current plugin's dedicated staging acceptance workflow instead.`
  );
};
