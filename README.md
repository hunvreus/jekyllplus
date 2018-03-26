# Jekyll+ (CMS)

Jekyll+ CMS is a Content Management System for Jekyll.

It provides a user friendly interface for users to edit the content of their Jekyll website hosted on GitHub (for now)

## Build Setup

``` bash
# Install dependencies
npm install

# Serve with hot reload at localhost:8080
npm run dev

# Build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## TODO

Feel free to get in touch if you wanna help.

- **Handle missing `.jekyllplus.yml` file**: if the file is missing in the branch, propose to
  - Create a default one if it's the default branch,
  - Copy it from the master branch otherwise if possible (may need some Git tree magic).
  - Automatically configure collections based on `_config.yml` and latest entry in the collection folder.
- **Handle collections**: for now we're defaulting to a catch all "Files" view, should be one for each collection and listing meta data (i.e. title).
- **Improve model creation**:
  - Support creating on the fly fields if the file has undefined attributes in the YAML front matter.
- **Add widgets**:
  - Tag input
  - Autocomplete from third party
  - Map for coordinates and addresses
- **Offer image manipulation**: either through third party (CDN) and/or in-browser libraries (e.g cropping)
- **Review caching strategy**: especially once collections are supported.
- **Add support for GitHub pages status**: for build & errors (see https://developer.github.com/v3/repos/pages/). Then integrate Jekyll+ hosting.
- **Add visual interface for configuration**: especially for configuring fields on collections.
- **Support Gitlab**: not sure Bitbucket is interesting for now (doesn't seem to be as straightforward).
- **Make multiple fields draggable**: allowing users to sort multiple fields values by drag & drop.
