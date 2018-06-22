import vscode from 'vscode'
import convert from 'css-in-js-helpers'
import autocomplete from './autocomplete'

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
  const convertCommand = vscode.commands.registerCommand(
    'extension.convertCSSinJS',
    () => {
      const editor = vscode.window.activeTextEditor

      // return if there's no editor or it's not a javascript file
      if (
        !editor ||
        !/javascript|typescript|javascriptreact/.test(editor.document.languageId)
      ) {
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
  const codeCompletion = vscode.languages.registerCompletionItemProvider(
    'javascript',
    {
      provideCompletionItems (document, position, token) {
        const start = new vscode.Position(position.line, 0)
        const range = new vscode.Range(start, position)
        const text = document.getText(range)

        if (autocomplete.isCompletingPseudoSelector(text)) {
          return autocomplete.getPseudoSelectorCompletions(text)
        }

        if (autocomplete.isCompletingValue(text)) {
          return autocomplete.getPropertyValueCompletions(text)
        }

        if (autocomplete.isCompletingName(text)) {
          return autocomplete.getPropertyNameCompletions(text)
        }
      },
      resolveCompletionItem (item, token) {
        return item
      }
    }
  )

  context.subscriptions.push(convertCommand)
  context.subscriptions.push(codeCompletion)
}

module.exports = { activate }
