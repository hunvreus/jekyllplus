document.addEventListener('DOMContentLoaded', function() {
  JEKYLLPLUS_URL = JEKYLLPLUS_URL || '//cms.jekyllplus.com';
  JEKYLLPLUS_MENU = JEKYLLPLUS_MENU || [
    { label: 'Create a page', path: 'new?collection=pages' },
    { label: 'Create a post', path: 'new?collection=posts' }
  ];
  var JEKYLLPLUS_PREFIX = JEKYLLPLUS_URL + '/' + JEKYLLPLUS_REPO + '/';

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
      jekyllplus_content += (typeof JEKYLLPLUS_MENU[i].path === 'undefined') ?
        '  <a target="_blank" href="' + JEKYLLPLUS_MENU[i].url + '">' + JEKYLLPLUS_MENU[i].label + '</a>':
        '  <a target="_blank" href="' + JEKYLLPLUS_PREFIX + JEKYLLPLUS_MENU[i].path + '">' + JEKYLLPLUS_MENU[i].label + '</a>';
    }
    jekyllplus_content += '  <hr/>';
    jekyllplus_content += '  <a target="_blank" href="' + JEKYLLPLUS_PREFIX + 'edit/' + encodeURIComponent(JEKYLLPLUS_PATH) + '">Edit this page</a>';
    jekyllplus_content += '  <a target="_blank" href="' + JEKYLLPLUS_PREFIX + 'new?duplicate=' + encodeURIComponent(JEKYLLPLUS_PATH) + '">Duplicate this page</a>';
    jekyllplus_content += '</div>';
    jekyllplus.innerHTML = jekyllplus_content;
    document.body.appendChild(jekyllplus);
  }
});
