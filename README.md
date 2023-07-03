# Quick Form
Vue component to produce form dynamically based on a schema definition.

## dev
Runs the code base locally in development. To run on of the different views change the view param in src/main.js.  index.html in the root is the entry file for the server.  Main.js pass options to select api and schema to run.

## preview
Runs the code base after being built but not as a self embedded component.  Preview uses public/preview/index.html as the entry point template.  However, points directly to dist/dev/es/preview/index.html and uses dist/dev/es/ as the server root.

Change the view param on the fly in dist/dev/es/preview/index.html

## preview-widget 

Runs the code base after being built and using the one line self embedding component. Preview-widget uses public/preview/widget/index.html as the entry point template. However, points directly to dist/dev/es/preview/widget/index.html and uses dist/dev/es/ as the server root.

Change the view param on the fly in dist/dev/es/preview/widget/index.html

## release-dev-s3
1. build
2. Replace reference to self in dist/import-map.json to s3 location.  '@scbd/idb-views': 'https://scbd-components.s3.amazonaws.com/%40scbd/idb-views%40${version}/dist/widget/index.js'
3. In src/widget.js pass cdnUrl to WidgetBuilder

Test the widget released on dev
```
<script 
      type = "module"
      src  = "https://scbd-components.s3.amazonaws.com/%40scbd/idb-views%400.0.2-alpha/dist/widget/index.js?d"
      options = "{ 
                    debug      : true,
                    baseApiUrl : 'https://api.cbddev.xyz/api',
                    accountsUrl: 'https://accounts.cbddev.xyz',
                    year       : 2023,
                    view       : 'IdbActionsAdmin',
                    editUrl    : 'https://rjh.bioland.cbddev.xyz/idb-message'
                  }"> 
</script>
```
# release

Release directly to npm for prod.  This need to be removed for ci release on pr.

# clean-reinstall

deletes all node_modules and reinstalls all dependencies fresh.


# options

```
{ 
  // required by all

    view        : '', // oneOf: [ 'IdbMessages', 'IdbMessagesAdmin','IdbActions', 'IdbActionsAdmin', 'IdbMessagesCommunity', 'IdbActionsCountries' ]
    baseApiUrl  : 'https://api.cbd.int/api',
    accountsUrl : 'https://accounts.cbd.int',
    editUrl     : '', // url that homes edit form component for message or action
    year        : '', // year of the IDB

  // required by all
  
  // required by views: ['IdbMessages','IdbMessagesCommunity']

    order       : [], // defines which types in what order are displayed on IdbMessages and what types not displayed on IdbMessagesCommunity

  // required by views: ['IdbMessages','IdbMessagesCommunity']

  // required by views: ['IdbActionsCountries']

    countryBaseUrl:'https://rjh.bioland.cbddev.xyz/biodiversity-day/celebrations', the base url that will end with a country code https://rjh.bioland.cbddev.xyz/biodiversity-day/celebrations/ca

  // required by views: ['IdbActionsCountries']

  // required by views: ['IdbActions']

  country     : '', // specifies current country to display

  // required by views: ['IdbActions']

  debug       : false
}
```