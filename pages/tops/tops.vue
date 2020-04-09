<template>
	<view>
		<view class="status_bar">
			<view class="top-box">
				<view class="homes" @click="back()">
					<image src="../../static/返回%20.png" class="back">
				</view>
				<view class="titles">
					<text class="titles-text">排行榜歌单</text>
				</view>
			</view>
		</view>
		<view class="rg-content">
			<view class="rg-pic">
				<view class="top-left">
					<image src="../../static/播放%20(1).png" class="begins">
				</view>
				<view class="top-certer">播放全部<text class="alls">(共{{alls}}首)</text></view>
				<view class="top-right">
					<view class="red-box">+收藏({{sub}})</view>
				</view>
			</view>
			<view class="rg-texts">
				<view class="rg-text" :key="item" v-for="(item,index) in texts" >
					<text class="text-1">{{index+1}}</text>
					<view class="text-2" @click="plays(item,index)">
						<view class="rg-namebox">
							<view class="rg-name">{{item.name}}</view>
							<view class="rg-uname">{{item.ar[0].name}} - {{item.al.name}}</view>
						</view>
						<view class="rg-right">
							<view class="rg-right-box">
								<image src="../../static/播放.png" class="begin">
							</view>
						</view>
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
				uid: "",
				rgid: "",
				texts: "",
				alls: "",
				sub: "",
				songid:"",
				//传值
				conunt:"",
				songsid:"",
				songsname:"",
				allsong:[],
				ids:[],
				index:""
			}
		},
		onLoad(e) {
			this.uid = e.id
			this.alls = e.alls
			this.sub = e.sub
			uni.request({
				url: 'http://musicapi.leanapp.cn/playlist/detail?id=' + this.uid + '',
				success: (res) => {
					this.texts = res.data.playlist.tracks
					this.conunt = res.data.playlist.subscribedCount
					this.allsong = res.data.privileges
					for (let i = 0; i < this.allsong.length; i++) {
						this.ids.push(this.allsong[i].id)
					}
				}
			})
		},
		methods: {
			plays(e,index){
				this.songid = e.id
				uni.request({
					url: 'http://musicapi.leanapp.cn/song/detail?ids='+this.songid+'',
					success: (res) => {
						this.songsid = res.data.songs[0].id
						this.songsname = res.data.songs[0].name
						uni.navigateTo({
							url: '../play/play?id='+this.songsid+'&name='+this.songsname+'&ids='+this.ids+'&index='+index+''
						})
						
					}
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>
	.status_bar {
		height: 140rpx;
		width: 100%;
		background: #31C27C;
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

	.rg-pic {
		width: 100%;
		height: 90rpx;
		border: 1px solid #ccc;
	}

	.rg-texts {
		height: auto;
		width: 100%;
	}

	.rg-text {
		width: 100%;
		height: 120rpx;
	}

	.rg-content {
		width: 100%;
		height: auto;
	}

	.text-1 {
		width: 120rpx;
		height: 120rpx;
		display: inline-block;
		text-align: center;
		line-height: 120rpx;
		color: #9197B2;
		font-size: 32rpx;
		float: left;
	}

	.top-left {
		width: 120rpx;
		height: 90rpx;
		display: inline-block;
		font-size: 32rpx;
		float: left;
		text-align: center;
		line-height: 116rpx;
	}

	.begins {
		width: 50rpx;
		height: 50rpx;
		display: inline-block;
	}

	.top-certer {
		display: inline-block;
		width: 301rpx;
		height: 90rpx;
		float: left;
		font-size: 28rpx;
		line-height: 90rpx;
	}

	.alls {
		font-size: 24rpx;
		color: #8F8F94;
	}

	.top-right {
		display: inline-block;
		width: 330rpx;
		height: 90rpx;
		float: left;

	}

	.red-box {
		width: 100%;
		height: 90rpx;
		background: red;
		color: #FFFFFF;
		font-size: 26rpx;
		line-height: 90rpx;
		text-align: center;
		border-radius: 0px 30rpx 0px 0px;
	}

	.text-2 {
		display: inline-block;
		width: 631rpx;
		height: 120rpx;
		float: left;
		border-bottom: 1.5px solid #F2F2F2;
	}

	.rg-namebox {
		width: 520rpx;
		display: inline-block;
		height: 120rpx;
		float: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.rg-name {
		width: 100%;
		height: 50rpx;
		display: block;
		font-size: 33rpx;
		margin-top: 27rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.rg-uname {
		width: 100%;
		height: 50rpx;
		font-size: 25rpx;
		color: #939397;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.rg-right {
		float: left;
		width: 111rpx;
		height: 120rpx;
	}

	.rg-right-box {
		text-align: center;
		width: 100%;
		height: 120rpx;
		line-height: 120rpx;
	}
</style>
