document.addEventListener('DOMContentLoaded', function() {
  var jekyllplus = document.createElement('div');
  jekyllplus.setAttribute('id', 'jekyllpro');

  var jekyllplus_content = '';
  jekyllplus_content += '<div class="menu">';
  jekyllplus_content += '<svg viewBox="0 0 260 260" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
  jekyllplus_content += '<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">';
  jekyllplus_content += '<g id="Group" transform="translate(20.000000, 20.000000)" fill="#0070E0">';
  jekyllplus_content += '<path d="M40,80 L40,120 L80,120 L80,80 L140,80 L140,140 L180,140 L180,40 L80,40 L80,0 L40,0 L40,40 L2.4492936e-15,40 L0,80 L40,80 Z M110,210 C71.3400675,210 40,178.659932 40,140 L180,140 C180,178.659932 148.659932,210 110,210 Z M110,170 C126.568542,170 140,156.568542 140,140 L80,140 C80,156.568542 93.4314575,170 110,170 Z" id="Combined-Shape"></path>';
  jekyllplus_content += '</g>';
  jekyllplus_content += '</g>';
  jekyllplus_content += '</svg>';
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
});
