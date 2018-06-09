module.exports = {

  head: {
    title: '网易云音乐',
    meta: [
      { charset: 'utf-8' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
      { name: 'renderer', content: 'webkit' },
      { name: 'full-screen', content: 'yes' },
      { name: 'x5-fullscreen', content: 'true' },
      { name: 'browsermode', content: 'application' },
      { name: 'x5-page-mode', content: 'app' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-touch-fullscreen', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/netease.ico' },
      { rel: 'stylesheet', href: 'https://cdn.bootcss.com/mui/3.7.1/css/mui.min.css'},
      { rel: 'stylesheet', href: '//g.alicdn.com/msui/sm/0.6.2/css/sm.min.css' },
      { rel: 'stylesheet', href: '//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' },
      { rel: 'stylesheet', href: 'https://cdn.bootcss.com/cropper/4.0.0-beta/cropper.min.css' }
    ],
    script: [
    	{ src: 'https://cdn.bootcss.com/mui/3.7.1/js/mui.min.js'},
    	{ src: 'https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js'},
    	{ src: 'https://cdn.bootcss.com/cropper/4.0.0-beta/cropper.min.js'},
    	{ src: 'http://api.map.baidu.com/api?v=2.0&ak=G50KhskST5pC3O3rli2HsQa8GFgojP52'}
    ]
  },
	
	cache: true,

  loading: false,
	
	css: [
		'~/assets/css/base.css',
		'mint-ui/lib/style.css'
	],
	
	plugins: [
		'~/plugins/mint-ui',
		'~/plugins/lazyload',
		'~/plugins/filter'
	],

  build: {
		vendor: [
			'axios'
		]
  },
  
  router: {
    linkActiveClass: 'tab-active',
    middleware: 'auth'
  }
}
