import MapForm from '@/fragments/forms/map-form/MapForm'
import Footer from '@/fragments/footer/Footer'
import ProfileSelector from '@/fragments/forms/profile-selector/ProfileSelector.vue'
import resolver from '@/support/routes-resolver'
import TopMenu from './components/top-menu/TopMenu'
import constants from '@/resources/constants'

export default {
  data () {
    return {
      clipped: false,
      drawer: true,
      right: false,
      fixed: false,
      menuItems: [],
      subMenuOpen: [],
      activeTab: '0'
    }
  },
  computed: {
    isSideBarOpen: {
      get () {
        return this.$store.getters.leftSideBarOpen
      },
      set (open) {
        this.$store.commit('setLeftSideBarIsOpen', open)
        // If the side bar is closed by a user's action, then
        // we can set the sidebar pined status as false
        if (open === false) {
          this.$store.commit('setLeftSideBarIsPinned', open)
        }
      }
    },
    homeUrl () {
      let url = resolver.homeUrl()
      return url
    },
    sidebarContentHeightFormula () {
      let formula = 'calc(100% - 100px)'
      return formula
    }
  },
  methods: {
  },
  created () {
    this.$store.dispatch('fetchMainMenu').then(() => {
      this.menuItems = this.$store.getters.mainMenu
    })
    /**
     * Set sidebar open status
     */
    let context = this
    this.eventBus.$on('setSidebarStatus', (isOpen) => {
      // pass a boolean that indicates 'force'
      context.$store.commit('setLeftSideBarIsOpen', isOpen)
    })
  },
  components: {
    ProfileSelector,
    MapForm,
    appFooter: Footer,
    TopMenu
  }
}