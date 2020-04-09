<template>
	<view>
		<view class="status_bar">
			<view class="top-box">
				<view class="homes" @click="back()">
					<image src="../../static/返回%20.png" class="back">
				</view>
				<view class="titles">
					<text class="titles-text">{{songname}}</text>
				</view>
			</view>
		</view>
		<view class="play-box">
			<view class="play-b-bbxs" :style="{backgroundImage:'url('+pic+')'}"></view>
			<view class="bg-a">
				<view class="ba-box">
					<view class="songsname">
						<view class="songname-1">{{songname}}</view>
						<view class="songname-2">{{uname}}</view>
					</view>
					<view class="song-img">
						<image :src="pic" class="song-imgbox">
					</view>
					<view class="song-text">
						歌词
					</view>
					<view class="song-list">
						<view class="uni-padding-wrap uni-common-mt titer">
							<slider :value="currentTime" show-value="" @change="sliderChange" block-size="15" block-color="#FFF100" :min="0"
							 :max="durations" />
						</view>
						<view class="times">{{duration}}</view>
					</view>
					<view class="song-play">
						<image :src="dexpic" class="xunuan-pic" @click="rund">
						<image src="../../static/上一个.png" class="top-pic" @click="topsong">
						<image :src="stoppic" class="stop-pic" @click="stop">
						<image src="../../static/下一个.png" class="next-pic" @click="next">
						<image src="../../static/歌单.png" class="songs-pic">
					</view>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				id: "", //传过来的歌曲id		
				songname: "", //传过来的歌曲名字
				pic: "", //传过来的歌曲图片
				uname: "", //歌手名
				stops: true, //停止播放
				audio: "", //播放组建
				duration: "", //歌曲总时长
				durations: "", //value最大值
				currentTime: "", //value值
				num: 0, //最小值
				stoppic: "../../static/播放-暂停.png",
				index: "", //歌曲下标
				ids: [], //歌曲所有的id
				dexpic: "../../static/循环.png",
				numdex: "0" ,//单曲循环
				suiji:""
			}
		},
		onLoad(e) {
			//传值过来的id
			this.index = e.index
			this.ids = e.ids.split(',')
			
			this.id = e.id
			this.songname = e.name
			uni.request({
				url: 'http://musicapi.leanapp.cn/song/detail?ids=' + this.id + '',
				success: (res) => {
					this.pic = res.data.songs[0].al.picUrl
					this.uname = res.data.songs[0].ar[0].name
				}
			})

			//创建播放连接
			this.audio = uni.createInnerAudioContext();
			this.audio.src = 'https://music.163.com/song/media/outer/url?id=' + this.ids[this.index] + '.mp3 ';
			this.audio.autoplay = true;
			this.audio.onPlay(() => {})
			this.audio.onTimeUpdate(() => {
				this.audio.duration;
				setTimeout(() => {
					this.duration = 0 + (this.audio.duration / 60).toFixed(2)
					this.durations = Math.round(this.audio.duration)
				}, 1000)
				this.currentTime = this.audio.currentTime
			})
			this.audio.onEnded(() => {						//歌曲播放结束后事件
				if(this.numdex == 1){				//单曲循环
					this.audio.src = 'https://music.163.com/song/media/outer/url?id=' + this.ids[this.index] + '.mp3 ';
					this.audio.play()
					uni.request({
						url: 'http://musicapi.leanapp.cn/song/detail?ids=' + this.ids[(this.index)] + '',
						success: (res) => {
							this.songname = res.data.songs[0].name
							this.pic = res.data.songs[0].al.picUrl
							this.uname = res.data.songs[0].ar[0].name
						}
					})
				}else if(this.numdex == 0){			//自动播放
					this.next()	
				}else if(this.numdex == 2){			//随机播放
					this.suiji = Math.floor((Math.random()*this.ids.length))
					this.audio.src = 'https://music.163.com/song/media/outer/url?id=' + this.ids[this.suiji] + '.mp3 ';
					this.audio.play()
					uni.request({
						url: 'http://musicapi.leanapp.cn/song/detail?ids=' + this.ids[this.suiji] + '',
						success: (res) => {
							this.songname = res.data.songs[0].name
							this.pic = res.data.songs[0].al.picUrl
							this.uname = res.data.songs[0].ar[0].name
						}
					})
				}
			})
		},
		methods: {
			sliderChange(e) {
				this.currentTime = e.detail.value
			},
			back() { //返回上一页
				uni.navigateBack({
					delta: 1
				})
			},
			rund() { //循环
				if (this.numdex == 0){
					this.numdex = 1
					this.dexpic = "../../static/单曲循环.png"
				}else if(this.numdex == 1){
					this.numdex = 2
					this.dexpic = "../../static/随机播放.png"
				}else if(this.numdex == 2){
					this.numdex = 0
					this.dexpic = "../../static/循环.png"
				}else{}
			},
			stop() { //停止播放
				this.stops = !this.stops
				if (this.stops) {
					this.audio.play()
					this.audio.onPlay(() => {
						this.stoppic = "../../static/播放-暂停.png"
					})
				} else {
					this.audio.pause();
					this.audio.onPause(() => {
						this.stoppic = "../../static/暂停.png"
					})
				}
			},
			topsong() { //上一首
			if(this.numdex == 2){
				this.suiji = Math.floor((Math.random()*this.ids.length))
				this.audio.src = 'https://music.163.com/song/media/outer/url?id=' + this.ids[this.suiji] + '.mp3 ';
				this.audio.play()
				uni.request({
					url: 'http://musicapi.leanapp.cn/song/detail?ids=' + this.ids[this.suiji] + '',
					success: (res) => {
						this.songname = res.data.songs[0].name
						this.pic = res.data.songs[0].al.picUrl
						this.uname = res.data.songs[0].ar[0].name
					}
				})
			}else{
				if (this.ids[(this.index)] == this.ids[0]) {
					this.index = this.ids.length + 1
					this.audio.src = 'https://music.163.com/song/media/outer/url?id=' + this.ids[--(this.index)] + '.mp3 ';
				}
				this.audio.src = 'https://music.163.com/song/media/outer/url?id=' + this.ids[--(this.index)] + '.mp3 ';
				if (this.stops) {
					this.stoppic = "../../static/播放-暂停.png"
				} else {
					this.stoppic = "../../static/播放-暂停.png"
				}
				uni.request({
					url: 'http://musicapi.leanapp.cn/song/detail?ids=' + this.ids[(this.index)] + '',
					success: (res) => {
						this.songname = res.data.songs[0].name
						this.pic = res.data.songs[0].al.picUrl
						this.uname = res.data.songs[0].ar[0].name
					}
				})
			}
			},
			next() { //下一首
			if(this.numdex == 2){
				this.suiji = Math.floor((Math.random()*this.ids.length))
				this.audio.src = 'https://music.163.com/song/media/outer/url?id=' + this.ids[this.suiji] + '.mp3 ';
				this.audio.play()
				uni.request({
					url: 'http://musicapi.leanapp.cn/song/detail?ids=' + this.ids[this.suiji] + '',
					success: (res) => {
						this.songname = res.data.songs[0].name
						this.pic = res.data.songs[0].al.picUrl
						this.uname = res.data.songs[0].ar[0].name
					}
				})
			}else{
				if (this.ids[(this.index)] == this.ids[this.ids.length - 1]) {
					this.index = -1
					this.audio.src = 'https://music.163.com/song/media/outer/url?id=' + this.ids[(this.index)] + '.mp3 ';
				}
				this.audio.src = 'https://music.163.com/song/media/outer/url?id=' + this.ids[++(this.index)] + '.mp3 ';
				if (this.stops) {
					this.stoppic = "../../static/播放-暂停.png"
				} else {
					this.stoppic = "../../static/播放-暂停.png"
				}
				uni.request({
					url: 'http://musicapi.leanapp.cn/song/detail?ids=' + this.ids[(this.index)] + '',
					success: (res) => {
						this.songname = res.data.songs[0].name
						this.pic = res.data.songs[0].al.picUrl
						this.uname = res.data.songs[0].ar[0].name
					}
				})
			}
			}
		},
		onUnload() {
			this.audio.destroy();
		}
	}
</script>

<style>
	.status_bar {
		height: 140rpx;
		width: 100%;
		background: #31C27C;
	}

	@keyframes name {
		from {
			transform: (0deg)
		}

		to {
			transform: (100deg)
		}
	}

	.toTop {
		bottom: calc(var(--window-bottom) + 10px)
	}

	.top-box {
		width: 600rpx;
		height: auto;
		padding-top: 56rpx;
		position: relative;
	}

	.homes {
		display: inline-block;
		width: 80rpx;
		height: 53rpx;
		float: left;
	}

	.begin {
		width: 40rpx;
		height: 40rpx;
		display: inline-block;
	}

	.back {
		width: 40rpx;
		height: 40rpx;
		display: inline-block;
		padding-top: 8rpx;
		padding-left: 25rpx;
	}

	.titles {
		width: 517rpx;
		height: 53rpx;
		color: #FFFFFF;
		font-size: 26rpx;
		text-align: center;
		line-height: 53rpx;
		float: left;
	}

	.titles-text {
		margin-left: 65rpx;
	}

	.play-box {}

	.play-b-bbxs {
		float: left;
		width: 100%;
		opacity: 0.7;
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		-webkit-filter: blur(20px);
		-moz-filter: blur(20px);
		-o-filter: blur(20px);
		-ms-filter: blur(20px);
		filter: blur(20px);
		height: 1195rpx;
		text-align: center;
	}

	.bg-a {
		position: absolute;
		left: 10px;
		right: 10px;
		height: 1195rpx;
	}

	.ba-box {
		width: 95%;
		margin: auto;
	}

	.songsname {
		width: 100%;
		height: 100rpx;
		text-align: center;
		line-height: 50rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}

	.songname-1 {
		color: #FFFFFF;
		font-size: 32rpx;
		width: 100%;
		height: 40rpx;
	}

	.songname-2 {
		color: #C2AFA0;
		font-size: 26rpx;
		width: 100%;
		height: 40rpx;
	}

	.song-img {
		width: 430rpx;
		height: 430rpx;
		overflow: hidden;
		border-radius: 50%;
		margin: auto;
		animate: name 4s;
	}

	.song-imgbox {
		width: 100%;
		animate: name 4s;
	}

	.song-list {
		margin-top: 20rpx;
		width: 100%;
		height: 80rpx;
		margin-bottom: 30rpx;
	}

	.song-text {
		width: 100%;
		height: 250rpx;
		border: 1px solid red;
		margin-top: 20rpx;
		text-align: center;
	}

	.titer {
		width: 80%;
		height: 80rpx;
		float: left;
	}

	.times {
		width: 20%;
		height: 80rpx;
		float: left;
		text-align: center;
		line-height: 80rpx;
		font-size: 28rpx;
	}

	.song-play {
		width: 90%;
		height: 200rpx;
		margin: auto;
		display: flex;
		justify-content: space-between;
	}

	.xunuan-pic {
		width: 50rpx;
		height: 50rpx;
		margin-top: 37rpx;
	}

	.top-pic {
		width: 90rpx;
		height: 90rpx;
		margin-top: 15rpx;
	}

	.stop-pic {
		width: 110rpx;
		height: 110rpx;
	}

	.next-pic {
		width: 90rpx;
		height: 90rpx;
		margin-top: 10rpx;
	}

	.songs-pic {
		width: 50rpx;
		height: 50rpx;
		margin-top: 30rpx;
	}
</style>
