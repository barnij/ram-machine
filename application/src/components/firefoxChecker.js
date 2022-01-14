function isFirefox() {
  // check if browser is firefox - https://stackoverflow.com/a/49328524/13762883
  if (typeof InstallTrigger !== 'undefined') return true;

  return false;
}

module.exports = isFirefox;
