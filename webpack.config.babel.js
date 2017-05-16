export default function (env) {
  return require(`./webpack.${env}.babel.js`);
}
