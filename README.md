# Atom Autocomplete for React Native and css-in-js [![Star on GitHub][github-star-badge]][github-star][![Tweet][twitter-badge]][twitter]

[![PRs Welcome][prs-badge]][prs]
[![Version][version-badge]][package]
[![Downloads][downloads-badge]][package]
[![MIT License][license-badge]][LICENSE]

*WIP*

Now get Autocomplete for CSSinJS libraries using object styles.

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

![Autocomplete][autocomplete-demo]

Does not work for general objects
```js
let styles = {
  /* styles */
}
```
This is basically a fork of [autocomplete-css](https://github.com/atom/autocomplete-css)

<kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>J</kbd> to convert the css lines to js

![Convert][converter-demo]

Coming Soon

*Codemods for easy shifting between css-in-js libraries*

[autocomplete-demo]: https://github.com/ansumanshah/css-in-js/raw/master/cssinjs.gif
[converter-demo]: https://github.com/ansumanshah/css-in-js/raw/master/example.gif

[github-star-badge]: https://img.shields.io/github/stars/ansumanshah/css-in-js.svg?style=social
[github-star]: https://github.com/ansumanshah/css-in-js/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20Atom%20Autocomplete%20css-in-js!%20https://github.com/ansumanshah/css-in-js%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/ansumanshah/css-in-js.svg?style=social

[version-badge]: https://img.shields.io/apm/v/css-in-js.svg?style=flat-square
[package]: https://atom.io/packages/css-in-js
[downloads-badge]: https://img.shields.io/apm/dm/css-in-js.svg?style=flat-square
[license-badge]: https://img.shields.io/apm/l/css-in-js.svg?style=flat-square
[license]: https://github.com/ansumanshah/css-in-js/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
