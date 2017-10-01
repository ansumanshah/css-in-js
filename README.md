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

## [CSS in JS for VS Code](https://marketplace.visualstudio.com/items?itemName=paulmolluzzo.convert-css-in-js)

> Provides CSS in JS autocompletion and converts kebab-case CSS to camelCase CSS and vice versa

* Provides autocompletion options for CSS styles as a style object for use in CSS in JS (like [`glamorous`](https://github.com/paypal/glamorous/)!)
* Converts CSS between regular CSS syntax (strings) and CSS-in-JS syntax (style objects)

### Autocomplete
![autocomplete](https://user-images.githubusercontent.com/737065/30726961-1fbd6794-9f1c-11e7-828b-fc6793b238bc.gif)

### Convert CSS in JS
![demo](https://user-images.githubusercontent.com/737065/28219279-6ffbf4c4-6889-11e7-8d3d-51637fe90856.gif)

### How to Use CSS Conversion

Select some block of text in a `javascript` or `typescript` file and use `cmd+shift+p` to bring up the command palette, then select `Convert CSS-in-JS`.

Or use the keyboard shortcut `cmd+shift+j` (`ctrl+shift+j` on Windows).

---

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
