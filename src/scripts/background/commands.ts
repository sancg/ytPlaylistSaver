function checkCommandShortcuts() {
  chrome.commands.getAll((cmds) => {
    let missingShortcuts = [];
    for (let { name, shortcut } of cmds) {
      if (shortcut === '') {
        missingShortcuts.push(name);
      }
    }

    if (missingShortcuts.length > 0) {
      console.log(missingShortcuts);
    }
  });
}

export { checkCommandShortcuts };
