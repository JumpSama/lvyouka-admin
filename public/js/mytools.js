window.OnCodeScaned = function (code) {
  if (code) {
    var ev = new Event('input', { bubbles: true })
    ev.simulated = true
    document.getElementById('qrcode').value = code
    document.getElementById('qrcode').dispatchEvent(ev)
  }
}
