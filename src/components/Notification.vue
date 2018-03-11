const NotificationStore = {
  state: [], // here the notifications will be added

  addNotification: function (notification) {
    this.state.push(notification)
  },
  removeNotification: function (notification) {
    this.state.$remove(notification)
  }
}

var Notification = Vue.extend({
	template: '#notification',
  props: ['notification'],
  data: function () {
  	return { timer: null }
	},
  ready: function () {
  let timeout = this.notification.hasOwnProperty('timeout') ? this.notification.timeout : true
  if (timeout) {
  	let delay = this.notification.delay || 3000
      this.timer = setTimeout(function () {
        this.triggerClose(this.notification)
      }.bind(this), delay)
    }
  },

  methods: {
    triggerClose: function (notification) {
    	clearTimeout(this.timer)
      this.$dispatch('close-notification', notification)
    }
  }
})

var Notifications = Vue.extend({
	template: '#notifications',
  components: {
    notification: Notification
  },
  data () {
    return {
      notifications: NotificationStore.state
    }
  },
  methods: {
    removeNotification: function (notification) {
      NotificationStore.removeNotification(notification)
    }
  }
})

Vue.transition('fade', {
  enterClass: 'fadeInDown', // class of animate.css
  leaveClass: 'fadeOutDown' // class of animate.css
})

var App = new Vue({
  el: '#app',
  components: {
  	'notifications': Notifications
  },
  data() {
    return {
			// no Data Nessessary. Notifications are stored in the NotificationStore
    }
  },
  methods: {
  	showSuccessMessage: function () {
    	NotificationStore.addNotification({
      	title: "Success!!",
        text: "A Success Message",
        type: "success",
        timeout: true
      })
    },
    showAlertMessage: function () {
    	NotificationStore.addNotification({
        text: "An Alert Message, without a title",
        type: "alert"
        // timeout not specified - defaults to true
        // delay not specified, defaults to 3000
      })
    },
    showStickyMessage: function () {
    	NotificationStore.addNotification({
      title: "Sticky!!",
        text: "This message will not time out, you have to click the close button",
        type: "primary",
        timeout: false // won't disappear on it's own
      })
    }
  }
})
