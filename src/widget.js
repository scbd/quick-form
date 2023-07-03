import WidgetBuilder from 'https://cdn.cbd.int/@scbd/self-embedding-component@3.1.0'
import Package       from '../package.json'

// load external css for dependant components
const css = [
                'https://cdn.jsdelivr.net/npm/vue-advanced-cropper@2.8.8/dist/style.css',
                'https://cdn.jsdelivr.net/npm/vue-multiselect@3.0.0-beta.1/dist/vue-multiselect.css'
              ]

// ugly but required for context
const callingImportMetaUrl = import.meta.url

new WidgetBuilder({ Package, css, callingImportMetaUrl }, { cdnUrl: 'https://scbd-components.s3.amazonaws.com', buildWidget: DB_WIDGET_BUILD, buildWidgetMount: DB_WIDGET_MOUNT_BUILD, buildWidgetTest: DB_WIDGET_TEST_BUILD })