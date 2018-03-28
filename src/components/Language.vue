<template>
  <div class="language">
    <div v-if="lock" class="translations">
      <input type="text" :value="language" readonly="readonly"/>
      <a v-if="translations.length > 0" class="button" @click.prevent="show = true">Translations</a>
      <div v-if="translations.length > 0" class="modal" :class="{ active: show }" @click.self.prevent="show = false">
        <div class="box">
          <header class="header">
            <a class="close" @click.prevent="show = false">
              <svg viewBox="0 0 24 24">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
            </a>
            <h2>Translations</h2>
          </header>
          <section class="body">
            <table>
              <thead>
                <th>Language</th>
                <th>Status</th>
                <th></th>
              </thead>
              <tbody>
                <tr v-for="translation in translations" v-if="translation.code != model">
                  <td><strong>{{ translation.label }}</strong></td>
                  <td>
                    <span v-if="translation.exists == false">Not translated</span>
                    <span v-else>Translated</span>
                  </td>
                  <td class="controls">
                    <router-link v-if="translation.exists == false" :to="{ name: 'new', query: { translate: path, to: translation.code, from: model }}" target="_blank" class="button primary smaller">
                      Create translation
                    </router-link>
                    <router-link v-else :to="{ name: 'edit', params: { path: translation.path }}" target="_blank" class="button smaller">
                      Edit translation
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
    <span v-else class="select">
      <select v-model="model">
        <option v-for="language in languages" :value="language.code">{{ language.label }}</option>
      </select>
    </span>
  </div>
</template>

<script>
const languages = {
  ab: 'Abkhazian',
  aa: 'Afar',
  af: 'Afrikaans',
  ak: 'Akan',
  sq: 'Albanian',
  am: 'Amharic',
  ar: 'Arabic',
  an: 'Aragonese',
  hy: 'Armenian',
  as: 'Assamese',
  av: 'Avaric',
  ae: 'Avestan',
  ay: 'Aymara',
  az: 'Azerbaijani',
  bm: 'Bambara',
  ba: 'Bashkir',
  eu: 'Basque',
  be: 'Belarusian',
  bn: 'Bengali (Bangla)',
  bh: 'Bihari',
  bi: 'Bislama',
  bs: 'Bosnian',
  br: 'Breton',
  bg: 'Bulgarian',
  my: 'Burmese',
  ca: 'Catalan',
  ch: 'Chamorro',
  ce: 'Chechen',
  ny: 'Chichewa, Chewa, Nyanja',
  zh: 'Chinese',
  'zh-Hans': 'Chinese (Simplified)',
  'zh-Hant': 'Chinese (Traditional)',
  cv: 'Chuvash',
  kw: 'Cornish',
  co: 'Corsican',
  cr: 'Cree',
  hr: 'Croatian',
  cs: 'Czech',
  da: 'Danish',
  dv: 'Divehi, Dhivehi, Maldivian',
  nl: 'Dutch',
  dz: 'Dzongkha',
  en: 'English',
  eo: 'Esperanto',
  et: 'Estonian',
  ee: 'Ewe',
  fo: 'Faroese',
  fj: 'Fijian',
  fi: 'Finnish',
  fr: 'French',
  ff: 'Fula, Fulah, Pulaar, Pular',
  gl: 'Galician',
  gd: 'Gaelic (Scottish)',
  gv: 'Manx',
  ka: 'Georgian',
  de: 'German',
  el: 'Greek',
  kl: 'Kalaallisut, Greenlandic',
  gn: 'Guarani',
  gu: 'Gujarati',
  ht: 'Haitian Creole',
  ha: 'Hausa',
  he: 'Hebrew',
  hz: 'Herero',
  hi: 'Hindi',
  ho: 'Hiri Motu',
  hu: 'Hungarian',
  is: 'Icelandic',
  io: 'Ido',
  ig: 'Igbo',
  'id, in': 'Indonesian',
  ia: 'Interlingua',
  ie: 'Interlingue',
  iu: 'Inuktitut',
  ik: 'Inupiak',
  ga: 'Irish',
  it: 'Italian',
  ja: 'Japanese',
  jv: 'Javanese',
  kn: 'Kannada',
  kr: 'Kanuri',
  ks: 'Kashmiri',
  kk: 'Kazakh',
  km: 'Khmer',
  ki: 'Kikuyu',
  rw: 'Kinyarwanda (Rwanda)',
  rn: 'Kirundi',
  ky: 'Kyrgyz',
  kv: 'Komi',
  kg: 'Kongo',
  ko: 'Korean',
  ku: 'Kurdish',
  kj: 'Kwanyama',
  lo: 'Lao',
  la: 'Latin',
  lv: 'Latvian (Lettish)',
  li: 'Limburgish ( Limburger)',
  ln: 'Lingala',
  lt: 'Lithuanian',
  lu: 'Luga-Katanga',
  lg: 'Luganda, Ganda',
  lb: 'Luxembourgish',
  mk: 'Macedonian',
  mg: 'Malagasy',
  ms: 'Malay',
  ml: 'Malayalam',
  mt: 'Maltese',
  mi: 'Maori',
  mr: 'Marathi',
  mh: 'Marshallese',
  mo: 'Moldavian',
  mn: 'Mongolian',
  na: 'Nauru',
  nv: 'Navajo',
  ng: 'Ndonga',
  nd: 'Northern Ndebele',
  ne: 'Nepali',
  no: 'Norwegian',
  nb: 'Norwegian bokmål',
  nn: 'Norwegian nynorsk',
  ii: 'Sichuan Yi',
  oc: 'Occitan',
  oj: 'Ojibwe',
  cu: 'Old Church Slavonic, Old Bulgarian',
  or: 'Oriya',
  om: 'Oromo (Afaan Oromo)',
  os: 'Ossetian',
  pi: 'Pāli',
  ps: 'Pashto, Pushto',
  fa: 'Persian (Farsi)',
  pl: 'Polish',
  pt: 'Portuguese',
  pa: 'Punjabi (Eastern)',
  qu: 'Quechua',
  rm: 'Romansh',
  ro: 'Romanian',
  ru: 'Russian',
  se: 'Sami',
  sm: 'Samoan',
  sg: 'Sango',
  sa: 'Sanskrit',
  sr: 'Serbian',
  sh: 'Serbo-Croatian',
  st: 'Sesotho',
  tn: 'Setswana',
  sn: 'Shona',
  sd: 'Sindhi',
  si: 'Sinhalese',
  ss: 'Swati',
  sk: 'Slovak',
  sl: 'Slovenian',
  so: 'Somali',
  nr: 'Southern Ndebele',
  es: 'Spanish',
  su: 'Sundanese',
  sw: 'Swahili (Kiswahili)',
  sv: 'Swedish',
  tl: 'Tagalog',
  ty: 'Tahitian',
  tg: 'Tajik',
  ta: 'Tamil',
  tt: 'Tatar',
  te: 'Telugu',
  th: 'Thai',
  bo: 'Tibetan',
  ti: 'Tigrinya',
  to: 'Tonga',
  ts: 'Tsonga',
  tr: 'Turkish',
  tk: 'Turkmen',
  tw: 'Twi',
  ug: 'Uyghur',
  uk: 'Ukrainian',
  ur: 'Urdu',
  uz: 'Uzbek',
  ve: 'Venda',
  vi: 'Vietnamese',
  vo: 'Volapük',
  wa: 'Wallon',
  cy: 'Welsh',
  wo: 'Wolof',
  fy: 'Western Frisian',
  xh: 'Xhosa',
  'yi, ji': 'Yiddish',
  yo: 'Yoruba',
  za: 'Zhuang, Chuang',
  zu: 'Zulu'
};

export default {
  name: 'language',
  props: [ 'value', 'jekyllConfig', 'path', 'collection', 'sha' ],
  data: function() {
    return {
      username: this.$route.params.username,
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      token: this.$root.$data.token,
      model: this.value,
      lock: true,
      show: false,
      language: '',
      languages: [],
      translations: []
    };
  },
  mounted() {
    for (var i = 0, length = this.jekyllConfig.lang.length; i < length; i++) {
      this.languages.push({
        code: this.jekyllConfig.lang[i],
        label: languages[this.jekyllConfig.lang[i]]
      });
    }

    this.initLanguage();

    document.addEventListener('keydown', (e) => {
      if (e.keyCode == 27) this.show = false;
    });
  },
  watch: {
    '$route': function (to, from) {
      this.initLanguage();
    },
    'sha': function (to, from) {
      this.initLanguage();
    },
    'model': function (to, from) {
      this.$emit('input', this.model);
    }
  },
  methods: {
    initLanguage: function () {
      if (this.$route.query.translate) {
        this.model = this.$route.query.to;
      }
      if (this.model == null || this.model == '') {
        // No language defined yet: set it to default and make it editable
        this.lock = false;
        this.model = this.languages[0].code;
      }
      else {
        // Language is defined: lock it
        this.lock = true;
        this.language = languages[this.model];
        // Unless we're translating another entry, we're displaying translations
        if (this.$route.query.translate) return;
        this.setTranslations();
      }
    },
    setTranslations: function () {
      for (var i = 0, length = this.languages.length; i < length; i++) {
        if (this.languages[i].code != this.model) {
          this.getTranslation(this.languages[i].code);
        }
      }
    },
    getTranslation: function (lang) {
      // Attempt to retrieve the translation for a specific language
      var translation = '';
      if (this.collection == 'pages') {
        if (this.model == this.languages[0].code) {
          translation = lang + '/' + this.path;
        }
        else if (lang == this.languages[0].code) {
          translation = this.path.replace(this.model + '/', '');
        }
        else {
          translation = this.path.replace(this.model + '/', lang + '/');
        }
      }
      else {
        if (this.model == this.languages[0].code) {
          translation = this.path.replace('_' + this.collection + '/', '_' + this.collection + '/' + lang + '/');
        }
        else if (lang == this.languages[0].code) {
          translation = this.path.replace('_' + this.collection + '/' + this.model + '/', '_' + this.collection + '/');
        }
        else {
          translation = this.path.replace('_' + this.collection + '/' + this.model + '/', '_' + this.collection + '/' + lang + '/');
        }
      }
      var url = 'https://api.github.com/repos/' + this.username + '/' + this.repo + '/contents/' + translation;
      var params = {
        access_token: this.token,
        ref: this.ref,
        timestamp: Date.now()
      };
      this.$http.get(url, {params: params}).then(response => {
        // File exists
        this.translations.push({
          code: lang,
          label: languages[lang],
          path: translation,
          exists: true
        });
      }, response => {
        if (response.status == 404) {
          // File doesn't exist
          this.translations.push({
            code: lang,
            label: languages[lang],
            path: translation,
            exists: false
          });
        }
        else {
          // Otherwise, something is wrong
          this.$notify({
            type: 'error',
            text: 'Couldn\'t retrieve the translation (' + response.body.message + ')',
            duration: -1
          });
        }
      });
    },
  },
}
</script>
