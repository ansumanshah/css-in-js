import vscode from 'vscode'
import convert from './convert.js'

function positionFactory (positionObj) {
  return new vscode.Position(positionObj._line, positionObj._character)
}

function rangeFactory (selection) {
  return new vscode.Range(
    positionFactory(selection.start),
    positionFactory(selection.end)
  )
}

function activate (context) {
  const disposable = vscode.commands.registerCommand(
    'extension.convertCSSinJS',
    () => {
      const editor = vscode.window.activeTextEditor

      // return if there's no editor or it's not a javascript file
      if (!editor || !/javascript/.test(editor.document.languageId)) {
        return
      }

      const selection = editor.selection
      const text = editor.document.getText(selection)

      if (text.length > 0) {
        const range = rangeFactory(selection)
        editor.edit(builder => {
          return builder.replace(range, convert(text))
        })
      }
    }
  )

  context.subscriptions.push(disposable)
}

module.exports = { activate }
