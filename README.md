# Jekyll+ (CMS)

Jekyll+ is a Content Management System for Jekyl

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## TODO

Feel free to get in touch if you wanna help.

- **Handle missing `.jekyllplus.yml` file**: if the file is missing in the branch, propose to
  - Create a default one if it's the default branch,
  - Copy it from the master branch otherwise if possible (may need some Git tree magic).
- **Handle collections**: for now we're defaulting to a catch all "Files" view, should be one for each collection and listing meta data (i.e. title).
- **Improve model creation**:
  - Support creating on the fly fields if the file has undefined attributes in the YAML front matter.
  - More elegantly handle object (especially for multiple use case)
- **Add widgets**:
  - Tag input
  - Autocomplete from third party
  - Map for coordinates and addresses
- **Offer image manipulation**: either through third party (CDN) and/or in-browser libraries (e.g cropping)
- **Support
- **Extend configuration**:
  -
