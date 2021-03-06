import OrsExtendedPolyline from './ors-extended-polyline'
import { LPolyline, LTooltip} from 'vue2-leaflet'
import constants from '@/resources/constants'
import theme from '@/common/theme'
import Leaflet from 'leaflet'
import lodash from 'lodash'

export default {
  data () {
    return {
      orsExtendedPolyline: null,
      backgroundWeight: 11 // will automaticaly be changed based on the weight value on `created`
    }
  },
  components: {
    LPolyline,
    LTooltip
  },
  props: {
    options: {
      type: Object,
      Type: Array,
      default: function () {
        return {}
      }
    },
    route: {
      type: Object,
      default: function () {
        return {}
      }
    },
    latLngs: {
      type: Array,
      default: function () {
        return []
      }
    },
    weight: {
      type: Number,
      default: 7
    },
    focusedPolyIndex: {
      type: Number,
      default: null
    },
    color: {
      type: String,
      default: theme.primary
    },
    backgroundColor: {
      type: String,
      default: constants.routeBackgroundColor,
    },
    tooltip: {
      type: String,
      default: ''
    },
    draggable: {
      type: Boolean,
      default: false
    },
    notActive: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    focusedPolyIndex: function (newVal, oldVal) {
      if (newVal !== null) {
        this.showPolylinePointByIndex(newVal)
      }
    }
  },
  methods: {
    addStopViaPolylineDrag (data) {
      this.$emit('addStopViaPolylineDrag', data)
    },
    followPolyline (data) {
      this.$emit('followPolyline', data)
    },
    /**
     * When the polyline is clicked
     * check if it is active. If so, show clicked point
     * the polyline details. If not active, just
     * forward the event by emitting a vuejs `click` event
     * @param {*} event 
     * @emits click
     */
    click (event) {
      if (!this.notActive && this.$refs.foregroundPolyline.mapObject) {
        this.showPolylinePointDetails(event)
      } else {
        this.$emit('click', event)
      }
    },
    /**
     * Show the details of a polyline point
     * by firing the polylineClicked event
     * @param {Event} event 
     * @fire polylineClicked
     */
    showPolylinePointDetails (event) {
      const leafletPolylineObject = this.$refs.foregroundPolyline.mapObject
      let originalEvent = event.originalEvent || event
      originalEvent.stopPropagation()
      originalEvent.preventDefault()
      originalEvent.clckedOverPolyline = true
      leafletPolylineObject.fire('polylineClicked', event)
    },
    /**
     * Show the polyline point by index
     * @param {Number} polylineCoordsIndex 
     */
    showPolylinePointByIndex (polylineCoordsIndex) {
      const customEvent = new Event('showPolylinePointByIndex')
      const point = this.latLngsCoordinates[polylineCoordsIndex]
      customEvent.latlng = Leaflet.latLng(point[0], point[1])
      this.showPolylinePointDetails(customEvent)
    },
    tooltipClick (data) {
      this.$emit('tooltipClick', data)
    },
  },
  computed: {
    /**
     * Get the latlngs coodinate array
     * from the latLngs prop or from the route
     * coordinates or return an empty array
     * @returns {Array}
     */
    latLngsCoordinates () {
      if (this.latLngs.length > 0) {
        return this.latLngs
      } else {
        let latLngs = lodash.get(this.route, 'geometry.coordinates')
        if (latLngs && Array.isArray(latLngs) && latLngs.length > 0) {
          return latLngs
        } else {
          return []
        }
      }
    }
  },
  created () {
    if (this.latLngs.length === 0 && !lodash.get(this.route, 'geometry.coordinates')) {
      console.error('Latlngs or route object must be passed with valid values')
    } else {
      this.backgroundWeight = this.weight + 4
    
      // If draggable is defined via prop as true
      // then add the necessary attribute on the
      // options object
      if (this.draggable === true) {
        this.options.edit_with_drag = true
      }
      // This willa add custom behaviors to the vue2leaflet polyline
      this.orsExtendedPolyline = new OrsExtendedPolyline(this)
    }
  }
}
