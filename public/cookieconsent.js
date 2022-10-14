var popup
var GA_TRACKING_ID = ''
window.addEventListener('load', function () {
  window.cookieconsent.initialise(
    {
      //set revokeBtn if you don't want to see a tiny pullup bar overlapping your website
      //if revokeBtn is set, make sure to include a link to cookie settings in your footer
      //you can open your banner again with: popup.open();
      //revokeBtn: "<div class='cc-revoke'></div>",
      type: 'opt-in',
      theme: 'classic',
      palette: {
        popup: {
          background: '#000',
          text: '#fff',
        },
        button: {
          background: '#fd0',
          text: '#000',
        },
      },
      onInitialise: function (status) {
        // request gtag.js on page-load when the client already consented
        if (status == cookieconsent.status.allow) setCookies()
      },
      onStatusChange: function (status) {
        // resquest gtag cookies on a new consent
        if (this.hasConsented()) setCookies()
        else deleteCookies(this.options.cookie.name)
      },
      law: {
        regionalLaw: false,
      },
      location: true,
    },
    function (p) {
      popup = p
    }
  )
})

//it is absolutely crucial to define gtag in the global scope
window.dataLayer = window.dataLayer || []
function gtag() {
  dataLayer.push(arguments)
}
gtag('js', new Date())
gtag('config', 'G-XV91RNV97M', { anonymize_ip: true })

function addScript(url) {
  var s = document.createElement('script')
  s.type = 'text/javascript'
  s.async = 'true'
  s.src = url
  var x = document.getElementsByTagName('script')[0]
  x.parentNode.insertBefore(s, x)
}

function setCookies() {
  addScript('https://www.googletagmanager.com/gtag/js?id=G-KEN0F81YMH')
  addScript('https://www.googleoptimize.com/optimize.js?id=OPT-TV9C6H7')
  // you can add facebook-pixel and other cookies here
}

function deleteCookies(cookieconsent_name) {
  var keep = [cookieconsent_name, 'DYNSRV']

  document.cookie.split(';').forEach(function (c) {
    c = c.split('=')[0].trim()
    if (!~keep.indexOf(c))
      document.cookie =
        c + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/'
  })
}
