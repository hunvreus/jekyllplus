document.addEventListener('DOMContentLoaded', function() {
  var JEKYLLPLUS_URL = '//jekyllplus.wiredcraft.jekyllpro.com';
  var JEKYLLPLUS_PREFIX = JEKYLLPLUS_URL + '/' + JEKYLLPLUS_REPO + '/';
  var JEKYLLPLUS_MENU = [
    { label: 'Create a page', path: 'new?collection=pages' },
    { label: 'Create a post', path: 'new?collection=posts' }
  ];

  if ((window.location.href.indexOf('?jekyllplus=true') != -1) || (window.location.href.indexOf('&jekyllplus=true') != -1)) {
    localStorage.setItem('jekyllplus', 'show');
  }
  else if ((window.location.href.indexOf('?jekyllplus=false') != -1) || (window.location.href.indexOf('&jekyllplus=false') != -1)) {
    localStorage.setItem('jekyllplus', 'hide');
  }

  if (localStorage.getItem('jekyllplus') == 'show' || (typeof JEKYLLPLUS_SHOW != 'undefined' && JEKYLLPLUS_SHOW)) {
    var jekyllplus = document.createElement('div');
    jekyllplus.setAttribute('id', 'jekyllplus');
    var jekyllplus_content = '';
    jekyllplus_content += '<div class="menu">';
    jekyllplus_content += '<img src="http://jekyllplus.wiredcraft.jekyllpro.com/assets/logo.png"/>';
    jekyllplus_content += '</div>';
    jekyllplus_content += '<div class="options">';
    for (var i = 0; i < JEKYLLPLUS_MENU.length; i++) {
      jekyllplus_content += '  <a target="_blank" href="' + JEKYLLPLUS_PREFIX + JEKYLLPLUS_MENU[i].path + '">' + JEKYLLPLUS_MENU[i].label + '</a>';
    }
    jekyllplus_content += '  <hr/>';
    jekyllplus_content += '  <a target="_blank" href="' + JEKYLLPLUS_PREFIX + 'edit/' + encodeURIComponent(JEKYLLPLUS_PATH) + '">Edit this page</a>';
    jekyllplus_content += '  <a target="_blank" href="' + JEKYLLPLUS_PREFIX + 'new?duplicate=' + encodeURIComponent(JEKYLLPLUS_PATH) + '">Duplicate this page</a>';
    jekyllplus_content += '</div>';
    jekyllplus.innerHTML = jekyllplus_content;
    document.body.appendChild(jekyllplus);
  }
});
