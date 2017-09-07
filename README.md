# Autocomplete for React Native and css-in-js for Atom and VS Code

[![Star on GitHub][github-star-badge]][github-star][![Tweet][twitter-badge]][twitter]
[![PRs Welcome][prs-badge]][prs]
[![Version][version-badge]][package]
[![MIT License][license-badge]][LICENSE]

Now get Autocomplete for CSSinJS libraries using object styles.
<a href="https://app.codesponsor.io/link/jZ7oK2ZsGezatDv9YZW6fM3e/ansumanshah/css-in-js" rel="nofollow"><img src="https://app.codesponsor.io/embed/jZ7oK2ZsGezatDv9YZW6fM3e/ansumanshah/css-in-js.svg" style="width: 888px; height: 68px;" alt="Sponsor" /></a>

## Installation
```
apm install css-in-js
```
Or go to Settings → Install and search for `css-in-js`

## Usage
```js
const btnA = css({ /* styles */ });
const btnB = glamorous.div({ /* styles */ });
const btnC = StyleSheet.create({ /* styles */ });
```
Only works for these keywords by default you can edit in settings for more.

`glamorous | css | StyleSheet.create`

![ReactNative][native-demo]

![Autocomplete][autocomplete-demo]

Does not work for general objects
```js
let styles = {
  /* styles */
}
```
This is basically a fork of [autocomplete-css](https://github.com/atom/autocomplete-css)

## Convert CSS in JS

> Convert kebab-case CSS to camelCase CSS and vice versa

Converts CSS between regular CSS syntax (strings) and CSS-in-JS syntax (style objects)

<kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>J</kbd> to convert the css lines to js

![Convert][converter-demo]

![demo](https://raw.githubusercontent.com/ansumanshah/css-in-js/master/packages/vscode-css-in-js/demo.gif)

Coming Soon

*Codemods for easy shifting between css-in-js libraries*

[autocomplete-demo]: https://raw.githubusercontent.com/ansumanshah/css-in-js/master/packages/atom-css-in-js/cssinjs.gif
[native-demo]: https://raw.githubusercontent.com/ansumanshah/css-in-js/master/packages/atom-css-in-js/native.gif
[converter-demo]: https://raw.githubusercontent.com/ansumanshah/css-in-js/master/packages/atom-css-in-js/example.gif

[github-star-badge]: https://img.shields.io/github/stars/ansumanshah/css-in-js.svg?style=social
[github-star]: https://github.com/ansumanshah/css-in-js/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20Atom%20Autocomplete%20css-in-js!%20https://github.com/ansumanshah/css-in-js%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/ansumanshah/css-in-js.svg?style=social

[version-badge]: https://img.shields.io/apm/v/css-in-js.svg?style=flat-square
[package]: https://atom.io/packages/css-in-js
[license-badge]: https://img.shields.io/apm/l/css-in-js.svg?style=flat-square
[license]: https://github.com/ansumanshah/css-in-js/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
