'use babel';

import { CompositeDisposable } from 'atom';
import lines from './convertLines';
import css from './convertCSS';
import config from './config.json';
import autocomplete from './autocomplete';

export default {
  subscriptions: null,
  config: config,
  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'css-in-js:convert': () => this.convert(),
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  getProvider() {
    return [autocomplete];
  },

  convert() {
    let editor;
    if ((editor = atom.workspace.getActiveTextEditor())) {
      let selection = editor.getSelectedText();
      if (selection.length > 0) {
        if (selection.match(/{/g)) {
          editor.insertText(css(selection));
        } else {
          editor.insertText(lines(selection));
        }
      }
    }
  },
};
