<template>
  <div class="login">
    <a class="logo tooltip" href="https://jekyllplus.com" target="_blank">
      <svg viewBox="0 0 260 260" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Group" transform="translate(20.000000, 20.000000)" fill="#0070E0">
            <path d="M40,80 L40,120 L80,120 L80,80 L140,80 L140,140 L180,140 L180,40 L80,40 L80,0 L40,0 L40,40 L2.4492936e-15,40 L0,80 L40,80 Z M110,210 C71.3400675,210 40,178.659932 40,140 L180,140 C180,178.659932 148.659932,210 110,210 Z M110,170 C126.568542,170 140,156.568542 140,140 L80,140 C80,156.568542 93.4314575,170 110,170 Z" id="Combined-Shape"></path>
          </g>
        </g>
      </svg>
      <span class="text">Go to the official Jekyll+ website</span>
    </a>
    <p>You need to sign in with GitHub to be able to edit or create content with Jekyll+.</p>
    <!-- Login button pointing to the Oauth micro service -->
    <a href="https://micro-github-hslbktdkrz.now.sh/login?scope=repo" class="button primary larger">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H14.56C14.24,20.93 14.23,20.32 14.23,20.11L14.24,17.64C14.24,16.8 13.95,16.25 13.63,15.97C15.64,15.75 17.74,15 17.74,11.53C17.74,10.55 17.39,9.74 16.82,9.11C16.91,8.89 17.22,7.97 16.73,6.73C16.73,6.73 15.97,6.5 14.25,7.66C13.53,7.46 12.77,7.36 12,7.35C11.24,7.36 10.46,7.46 9.75,7.66C8.03,6.5 7.27,6.73 7.27,6.73C6.78,7.97 7.09,8.89 7.18,9.11C6.61,9.74 6.26,10.55 6.26,11.53C6.26,15 8.36,15.75 10.36,16C10.1,16.2 9.87,16.6 9.79,17.18C9.27,17.41 7.97,17.81 7.17,16.43C7.17,16.43 6.69,15.57 5.79,15.5C5.79,15.5 4.91,15.5 5.73,16.05C5.73,16.05 6.32,16.33 6.73,17.37C6.73,17.37 7.25,19.12 9.76,18.58L9.77,20.11C9.77,20.32 9.75,20.93 9.43,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3Z"/>
      </svg>
      Sign in with GitHub
    </a>
  </div>
</template>
