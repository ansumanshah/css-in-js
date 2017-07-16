import vscode from 'vscode'
import convert from './convert.js'

function positionFactory (positionObj) {
  return new vscode.Position(positionObj._line, positionObj._character)
}

function rangeFactory (selection, length) {
  if (length === 0) {
    selection.start._character = 0
    selection.end._character = vscode.window.activeTextEditor.document.lineAt(
      selection.start.line
    ).text.length
  }

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
      const lineText = editor.document.lineAt(selection.start.line).text
      const selectedText = editor.document.getText(selection)
      const convertableText = selectedText || lineText
      const range = rangeFactory(selection, selectedText.length)

      editor.edit(builder => builder.replace(range, convert(convertableText)))
    }
  )

  context.subscriptions.push(disposable)
}

module.exports = { activate }
