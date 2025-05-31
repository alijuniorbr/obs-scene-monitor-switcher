const fs = require("fs");

const base64 = `
iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABNElEQVR42u2XsQ2AIBCFZ2mK8ik6
5hjX+iwlJNNycgErZ5EcglqMtz9ytICtMhr8R4wQwgwz5pNQCsMGwVXQJ9tE0Rb6yAml2kED6IUy
AOrpmwCrILkaJABEtMu6Ir2rNInhDLiE9JZxrkKvgqkoBVWUgkQVVwUPCB3xL13ayIM2U+8lQKYQ
ZRMFErgDLZ6igYcFIW2whIOcIGWZYAhwSUu2WIakiyThA5iMc8CWgPGU9wjv+AfXcHPLc14rJ4gO
YB79g7c6+EAl1FkyZogA8wAAAABJRU5ErkJggg==
`;

fs.writeFileSync(
  "iconTemplate.png",
  Buffer.from(base64.replace(/\s/g, ""), "base64")
);
console.log("iconTemplate.png criado!");
