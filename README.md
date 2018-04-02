**This is an early version. It's functional, but there are still some missing features (see "Todo") and (maybe) a few bugs.**

# Jekyll+

Jekyll+ is a Content Management System for Jekyll.

It provides a user friendly interface for users to edit the content of their Jekyll website hosted on GitHub (for now).

<p align="center"><img src="https://user-images.githubusercontent.com/306868/38175180-c7e02184-360a-11e8-8b40-9df7b213a5f4.gif"/></p>

## Usage

### Use the online version at cms.jekyllplus.com

You can simply go to https://cms.jekyllplus.com, log in with your GitHub account and select the GitHub repository for your Jekyll website.

By default, Jekyll+ will load a default configuration (`/assets/default.yml` in this repo) which defines fields for `posts` and `pages` collections.

### Customize fields

If you want to customize the fields and/or support additional collections, you will need to add a `.jekyllplus.yml` file at the root of the repo hosting your site. Use the [default configuration](https://github.com/Wiredcraft/jekyllplus/blob/master/assets/default.yml) as an example:

```
# folders:
#   file: files
#   image: images

collections:
  pages:
    name: Pages
    fields:
      - name: published
        label: Published
        type: switch
        default: true
      - name: title
        label: Title
        type: string
      - name: description
        label: Description
        type: string
        description: This may be used for SEO (<meta name="description"</code>).
      - name: category
        label: Categories
        type: tags
      - name: image
        label: Image
        type: image
        description: This may be used as a preview in social cards.
      - name: layout
        label: Layout
        type: string
      - name: body
        label: Body
        type: markdown
        autoresize: true
  posts:
    name: Posts
    fields:
      - name: published
        label: Published
        type: switch
        default: true
      - name: title
        label: Title
        type: string
      - name: date
        label: Date
        type: date
      - name: description
        label: Description
        type: string
        description: This may be used for SEO (<meta name="description">).
      - name: category
        label: Categories
        type: tags
      - name: image
        label: Image
        type: image
        description: This may be used as a preview in social cards.
      - name: body
        label: Body
        type: markdown
        autoresize: true
```

A few things:

- **Collections**: you can define as many collections as you want by adding an object to the `collections` attribute that matches the collection name in Jekyll.
- **Fields**: you can add any number of fields with the following attributes:
  - `name`: the name that will be used in the YAML front matter.
  - `label`: the label displayed above the field.
  - `type`: you can define the type of widget/field you want for each field by specifying the type. It currently supports:
    - `string`: a regular string (`<input type='text'/>`).
    - `hidden`: hidden value.
    - `file`: file picker, triggers a simple file browser that allows the user to select and upload files. User
    - `image`: same as `file` but restricted to images.
    - `tags`: tag input.
    - `checkbox`: checkbox.
    - `switch`: same as the checkbox, but styled as a switch.
    - `date`: date input.
    - `select`: regular select box. Requires you to define `options`, either as an array of values (`['Option A', 'Option B']`), an array of objects for values/labels (`[ { value: 'option_1', label: 'Option 1' } ]`) or a mix of both.
    - `text`: simple textarea.
    - `markdown`: markdown editor (using [CodeMirror](https://codemirror.net/)). If set with `autoresize: true`, makes the editor adjusts dynamically to the height of the content.
    - `object`: allows to define multiple children fields (requires a `fields` attribute).
  - `default`: default value for the field.
  - `options`: see `select` type above.
  - `multiple`: when set to `true`, allows the user to add multiple instances of the field (this making the field an array of values).
- **Folders**: as hinted at in the default configuration, you can define default folders for images and files by setting `folders.images` and `folders.files`.

## Multilingual support

<p align="center"><img width="717" alt="jekyllplus-language" src="https://user-images.githubusercontent.com/306868/38175177-be9e7a80-360a-11e8-9478-4e46317c0a2a.png"></p>
<p align="center"><img width="595" alt="jekyllplus-translations" src="https://user-images.githubusercontent.com/306868/38175176-be6a189e-360a-11e8-96c1-63a420de64d8.png"></p>

When defining a collection, you can set `multilingual` to `true`, for example:

```
collections:
  pages:
    name: pages
    multilingual: true
    fields:
      ...
```

A few things about this feature:

1. **It requires an array of languge codes in `_config.yml`**, for example `lang: [ 'en', 'fr', 'cn' ]` if you want English to be the default language, with French and Chinese as alternative languages.
2. **It will save translations in subfolders**. For example, if English is the default language, the English pages will show at the root of the site and posts will be at the root of `_posts`. French pages would be available in the `fr/` subfolder, translated posts would be in `_posts/fr/`.
3. **It relies on the `lang` and `categories` attributes in the YAML front matter**. For the default language, content only has a `lang` attribute (e.g. `lang: en`). Translation have both:

```
lang: fr
categories: fr
```

For an example of this in action, go check the [Wiredcraft/jekyll-basics](https://github.com/Wiredcraft/jekyll-basics) repo (demo site at http://wiredcraft.github.io/jekyll-basics/).

### Add a widget on your website

<p align="center"><img width="152" alt="jekyllplus-widget" src="https://user-images.githubusercontent.com/306868/38175196-4c8cd724-360b-11e8-8be0-2d66214fd4e0.png"></p>

I strongly recommended you add the Jekyll+ widget to your site (it's part of why I haven't yet bothered to add a user-friendly way to browse collections).

It adds a (hidden) menu to your pages that allows you to easily edit/duplicate pages and add content straight from your site.

To do so, just add the following at the bottom of all of your pages (probably using an include in your default layout):

```
<script>
var JEKYLLPLUS_REPO = 'org/repo/branch';
var JEKYLLPLUS_PATH = '{{ page.path }}';
</script>
<script src='//cms.jekyllplus.com/assets/widget.js'/></script>
<link rel='stylesheet' href='//cms.jekyllplus.com/assets/widget.css'/>
```

Obviously, replace `'org/repo/branch'` with your repo and branch information (I'm working on automating this).

You can also point at your own client url for the JS and CSS files. For example, if working with your local dev version:

```
<script src='//localhost:8080/assets/widget.js'/></script>
<link rel='stylesheet' href='//localhost:8080/assets/widget.css'/>
```

By default, the widget offers link to edit or duplicate the content of the current page (this is what `JEKYLLPLUS_PATH` is for), as well as links to create a new page or a new post. You can extend the list of menu items, especially if you have custom collections, by defining the `JEKYLLPLUS_MENU` array. For example:

```
var JEKYLLPLUS_MENU = JEKYLLPLUS_MENU || [
  { label: 'Create a page', path: 'new?collection=pages' },
  { label: 'Create a post', path: 'new?collection=posts' },
  { label: 'Create a news', path: 'new?collection=news' },
  { label: 'See all files', path: 'files' },
  { label: 'Go to Google', url: 'https://google.com' }
];
```

Note that you can use a `url` attribute instead of `path` if you want to point at a full url.

## Installation & development

You can run Jekyll+ on your own. The client is a simple Vue.js application:

``` bash
# Install dependencies
npm install

# Serve with hot reload at localhost:8080
npm run dev

# Build for production with minification
npm run build
```

Additionally, you'll need a microservice for the GitHub Oauth. Simply deploy [Wiredcraft/micro-github ](https://github.com/Wiredcraft/micro-github) with [now](https://zeit.co/now):

```
now Wiredcraft/micro-github -e GH_CLIENT_ID={CLIENT_ID} -e GH_CLIENT_SECRET={CLIENT_SECRET} -e REDIRECT_URL={CLIENT_URL}
```

`CLIENT_ID` and `CLIENT_SECRET` will come [from GitHub after you created an OAuth app](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/). The `Authorization callback URL` should point to the callback of your OAuth microservice (e.g. `https://micro-github-abcd1234.now.sh/callback`).

`CLIENT_URL` is the URL you'll be hosting the client at. For example, while developing it should be http://localhost:8080.

## TODO

- **Handle missing `.jekyllplus.yml` file**: if the file is missing in the branch, propose to
  - Create a default one if it's the default branch,
  - Copy it from the master branch otherwise if possible (may need some Git tree magic).
  - Automatically configure collections based on `_config.yml` and latest entry in the collection folder.
- **Handle collections**: for now we're defaulting to a catch all "Files" view, should be one for each collection and listing meta data (i.e. title).
- **Improve model creation**: support creating on the fly fields if the file has undefined attributes in the YAML front matter.
- **Extend fields settings**: improve default value, add mandatory fields, field validation, placeholders, collapsed fields...
- **Add widgets**:
  - Autocomplete from third party.
  - Map for coordinates and addresses.
- **Improve the file picker**: in particular it seems to fail with a lot of images and shouldn't try to load directory content until opened. It would also be useful to support multi-files upload and selection, as well as folder creation.
- **Offer image manipulation**: either through third party (CDN) and/or in-browser libraries (e.g cropping)
- **Review caching strategy**: especially once collections are supported.
- **Add support for GitHub pages status**: for build & errors (see https://developer.github.com/v3/repos/pages/). Then integrate Jekyll+ hosting.
- **Add visual interface for configuration**: especially for configuring fields on collections.
- **Make multiple fields draggable**: allowing users to sort multiple fields values by drag & drop.
- **Support Gitlab**: not sure Bitbucket is interesting for now (doesn't seem to be as straightforward).
