import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})

// Vue.prototype.ScanAudio = function() {
// 	const innerAudioContext = uni.createInnerAudioContext(); 
// 	innerAudioContext.src = 'https://music.163.com/song/media/outer/url?id=' + this.id + '.mp3 ';
// 	if(this.stops){
// 		innerAudioContext.autoplay = true;
// 		innerAudioContext.onPlay(() => {
// 			console.log('开始播放');
// 		})
// 	}else if(this.stops === false){
// 		innerAudioContext.stop();
// 		innerAudioContext.onStop(function(){
// 			console.log('停止播放');
// 		})
// 	}else{
// 		console.log(3333)
// 	}
	
// }
app.$mount()
