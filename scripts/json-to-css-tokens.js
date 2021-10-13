const fs = require("fs");
const prettier = require("prettier");
const _ = require("lodash");

// BASE TOKENS
const baseColors = require("../tokens/base/colors.tokens.json");
const baseDimensions = require("../tokens/base/dimensions.tokens.json");

// BRAND TOKENS
const brandTokens = require("../tokens/brand/brand.tokens.json");

// COMPONENT TOKENS
const buttonTokens = require("../tokens/components/button.tokens.json");

const tokens = {
  base: {
    ...baseColors,
    ...baseDimensions,
  },
  brand: brandTokens,
  components: {
    ...buttonTokens,
  },
};

let content = `:root{`;

const getTokens = (tokens, parentKey = "") => {
  return Object.entries(tokens).reduce((list, [sub, possibleValue]) => {
    const key = parentKey ? `${parentKey}.${sub}` : sub;

    if ("value" in possibleValue) {
      // We've hit a value
      return [...list, { key, ...possibleValue }];
    }

    return [...list, ...getTokens(possibleValue, key)];
  }, []);
};

const tokenList = Object.keys(tokens).reduce((list, group) => {
  const start = group === "base" ? "" : group;
  return [...list, ...getTokens(tokens[group], start)];
}, []);

const isVariable = (value) => {
  return value.startsWith("{") && value.endsWith("}");
};

const getPathFromVariable = (value) => {
  return value.slice(1, value.length - 1);
};

// const getRealTokenValue = (token) => {
//   if (isVariable(token.value)) {
//     const path = getPathFromVariable(token.value);
//     const _token = _.get(tokens, path);
//     return getTokenValue(_token);
//   }
//   return token.value;
// };

const excludedKeywords = ["base", "components"];
const keywordRenames = {
  button: "btn",
  background: "bg",
};

const getNameFromValue = (string) => {
  const start = isVariable(string) ? getPathFromVariable(string) : string;
  return start
    .split(".")
    .filter((n) => !excludedKeywords.includes(n))
    .map((n) => (n in keywordRenames ? keywordRenames[n] : n))
    .join("-");
};

const getTokenValue = (token) => {
  if (isVariable(token.value)) {
    const value = getNameFromValue(token.value);
    return `var(--${value})`;
  }

  return token.value;
};

tokenList.forEach((token) => {
  const name = getNameFromValue(token.key);
  const value = getTokenValue(token);
  content += `--${name}: ${value};`;
});

// Object.keys(tokens).forEach((group) => {
//   Object.entries(tokens[group]).forEach(([subGroup1, value]) => {
//     const start = group === "base" ? "" : `${group}-`;

//     if ("value" in value) {
//       content += `--${start}${subGroup1}: ${value.value};`;
//       return;
//     }

//     Object.entries(tokens[group][subGroup1]).forEach(([subGroup2, value]) => {
//       if ("value" in value) {
//         content += `--${start}${subGroup1}-${subGroup2}: ${value.value};`;
//       }
//     });
//   });
// });

content += `}`;

fs.writeFile("tokens.min.css", content, function (err) {
  if (err) throw err;
  console.log("Minified file is created successfully.");
});

const formatted = prettier.format(content, { parser: "css" });

fs.writeFile("tokens.css", formatted, function (err) {
  if (err) throw err;
  console.log("File is created successfully.");
});
