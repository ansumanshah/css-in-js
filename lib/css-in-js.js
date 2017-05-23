'use babel';

import { CompositeDisposable } from 'atom';
import convert from './convert';

export default {
  subscriptions: null,

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

  convert() {
    let editor;
    if ((editor = atom.workspace.getActiveTextEditor())) {
      let selection = editor.getSelectedText();
      if (selection.length > 0) {
        editor.insertText(convert(selection));
      }
    }
  },
};
