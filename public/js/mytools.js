window.OnCodeScaned = function (code) {
  if (code && document.getElementById('qrcode')) {
    var ev = new Event('input', { bubbles: true })
    ev.simulated = true
    document.getElementById('qrcode').value = code
    document.getElementById('qrcode').dispatchEvent(ev)
  }
}
