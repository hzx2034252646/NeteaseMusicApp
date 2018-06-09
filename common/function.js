
//获取随机颜色
export const GetRandomColor = function () {
   var color=''
   for(var i=0;i<6;i++){
      color += '0123456789abcdef'[Math.floor(Math.random() * 16)]
   }
   return '#' + color
}

//时间格式化
export const formatTime = function (t) {
   var min = Math.floor(parseFloat(t) / 60)
   var s = Math.floor(parseFloat(t)) - min * 60
   min = isNaN(min) ? 0 : min
   s = isNaN(s) ? 0 : s
   var min_str, s_str
   min_str = min < 10 ? '0' + min : '' + min
   s_str = s < 10 ? '0' + s : '' + s
   return min_str + ':' + s_str
}

//日期格式化
export const formatDate = function (timestamp) {
	var date = new Date(timestamp)
	var y = date.getFullYear()
	var m = date.getMonth()+1
	var d = date.getDate()
	return y+'.'+m+'.'+d
}

//图片链接格式化
export const formatPicUrl = function(pic, source) {
	var format = {
		netease_url(){
			pic = pic.replace(/http:\/\/(p3|p4)/,'http://p1').replace('400y400', '100y100')
		},
		kugou_url(){
			pic = pic.replace('softhead/400', 'softhead/100')
		},
		xiami_url(){
			pic = pic.replace('400h_400w', '100h_100w')
		},
		baidu_url(){
			pic = pic.replace('w_300', 'w_100').replace('h_300', 'h_100')
		},
		url(){
			this.netease_url()
			this.kugou_url()
			this.xiami_url()
			this.baidu_url()
		}
	}
	switch(source){
		case 'netease':
			format.netease_url()
			break 
		case 'kugou':
			format.kugou_url()
			break 
		case 'xiami':
			format.xiami_url()
			break 
		case 'baidu':
			format.baidu_url()
			break 
		default:
			format.url()
	}
	return pic 
}

//歌词解析
const parseLyric = function (song, json, time) {
   var lyric = [], m, s, ms, time_str, lyric_arr1
   //以换行符将歌词字符串分割成数组
   lyric_arr1 = song.replace(/\[([a-z]*):.*]/g, '').replace(/\/\//g, '').split(/\n/g)
   //过滤掉数组中的空字符串
   var lyric_arr2 = [], i
   for (i = 0; i < lyric_arr1.length; i++) {
      if (lyric_arr1[i] != '') {
         lyric_arr2.push(lyric_arr1[i])
      }
   }
   //创建json对象存储时间和歌词
   for (i = 0; i < lyric_arr2.length; i++) {
      time_str = lyric_arr2[i].match(/\d*:\d*\.\d*/g)
      if (!time_str) {
         continue
      }
      lyric[i] = lyric_arr2[i].split(']').slice(-1)
      for (var j = 0; j < time_str.length; j++) {
         m = parseInt(time_str[j].split(/[:\.]/g)[0])
         s = parseInt(time_str[j].split(/[:\.]/g)[1])
         ms = parseInt(time_str[j].split(/[:\.]/g)[2])
         time[j] = Math.floor((m * 60 + s + ms / 1000))
      }
      for (var k = 0; k < time_str.length; k++) {
         if (lyric[i] != '') {
            json[time[k]] = { "time": time[k], "lyric": lyric[i] }
         }
      }
   }
   //将json对象中的时间存入数组
   i = 0
   for (var key in json) {
      time[i++] = json[key].time
   }
   //时间排序
   function sortNumber(a, b) {
      return a - b;
   }
   time.sort(sortNumber)
}
//歌词加载
export const loadLyric = function (lyric, tlyric) {
   var json1 = {}, json2 = {}, time = [], time1 = [], time2 = []
   var i, $lyric = $('.lyric'), $content = $('.content')
   var audio=$('audio').get(0)
   $lyric.html('')
   if (!lyric) {
   	if($('#player .pic').css('display')!='none'){
      	$lyric.html('<p style="margin-top:20%">暂无歌词</p>')
      }else{
      	$lyric.html('<p style="margin-top:50%">暂无歌词</p>')
      }
      return
   }
   parseLyric(lyric, json1, time1)
   time = time1
   if (tlyric) {
      parseLyric(tlyric, json2, time2)
      time = time1.length > time2.length ? time1 : time2
      for (i = 0; i < time.length; i++) {
         if (!json2[time[i]]) {
            $lyric.append('<p data-time=' + time[i] + '>' + json1[time[i]].lyric + '</p>')
         } else {
            try {
               $lyric.append('<p data-time=' + time[i] + '>' + json1[time[i]].lyric + '<br><span class="trans">' + json2[time[i]].lyric + '</span></p>')
            } catch (err) { }
         }
      }
   } else {
      for (i = 0; i < time.length; i++) {
         $lyric.append('<p data-time=' + time[i] + '>' + json1[time[i]].lyric + '</p>')
      }
   }
   //歌词滚动
   function moveLyric() {
      var t, $p
      var h = $content.height();
      t = audio.currentTime
      for (var i = 0; i < time.length; i++) {
         if ((time[i] <= t && t < time[i + 1] && i < time.length - 1) || (i == time.length - 1 && t >= time[i])) {
            $p = $lyric.find('p[data-time="' + time[i] + '"]')
            $p.addClass('lyric-active').siblings().removeClass('lyric-active')
            let top
            if(typeof $lyric.find('.lyric-active').position() != 'undefined'){
            	top = $lyric.find('.lyric-active').position().top
            }
            let dis = tlyric ? (1 / 3) * h : (2 / 5) * h
            if($('#player .pic').css('display')!='none'){
            	dis = 0
            }
            $content.stop().animate({ scrollTop: top - dis }, 500)
            return
         }
      }
   }
   audio.addEventListener('timeupdate', moveLyric)
   //滚动歌词时停止自动滚动定位
   var timeout = null
   var autoScroll = true
   $content.scroll(function () {
      if (timeout != null) {
         clearTimeout(timeout)
      }
      autoScroll = false
      audio.removeEventListener('timeupdate', moveLyric)
      timeout = setTimeout(function () {
         autoScroll = true
         audio.addEventListener('timeupdate', moveLyric)
      }, 1000)
   })
}
