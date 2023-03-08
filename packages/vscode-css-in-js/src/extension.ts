import convert from 'css-in-js-helpers'
import vscode from 'vscode'
import autocomplete from './autocomplete'

export function activate(context) {
  const convertCommand = vscode.commands.registerCommand(
    'extension.convertCSSinJS',
    () => {
      const editor = vscode.window.activeTextEditor

      // return if there's no editor or it's not a javascript file
      if (
        !editor ||
        !/javascript|typescript/.test(editor.document.languageId)
      ) {
        return
      }

      const selection = editor.selection
      // console.log(selection);
      const lineText = editor.document.lineAt(selection.start.line).text
      // console.log(lineText);
      const selectedText = editor.document.getText(selection)
      // console.log(selectedText);
      const convertableText = selectedText || lineText

      editor.edit(builder => {
        builder.replace(editor.selection, convert(convertableText))
      })
    }
  )
  const codeCompletion = vscode.languages.registerCompletionItemProvider(
    'javascript',
    {
      provideCompletionItems(document, position, token) {
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
      resolveCompletionItem(item, token) {
        return item
      },
    }
  )

  context.subscriptions.push(convertCommand)
  context.subscriptions.push(codeCompletion)
}
