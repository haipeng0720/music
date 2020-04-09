<template>
	<view>
		<!-- 导航栏 -->
		<view class="status_bar">
			<view class="top-box">
				<input type="text" class="inp" @focus="cus" @blur="blur" @input="jianpan" />
				<text class="btn" @click="search">搜索</text>
			</view>
			<view class="list" v-if="show">
				<text class="list-title">热门搜索</text>
				<view class="list-host">
					<text class="list-box" v-for="(item,index) in hosts" :key="item">{{item.first}}</text>
				</view>
			</view>
			<view class="lists" v-if="shows">
				<text class="list-titles">相关歌曲</text>
				<view class="list-hosts">
					<view class="list-boxs" v-for="(item,index) in hostall" :key="item">
						<text class="list-boxs-text1">{{item.name}}</text>-<text class="list-boxs-text2">{{item.artists[0].name}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- tab切换 -->
		<view class="tab-box">
			<view class="tab-wid">
				<view class="box-a" @click="tabClick(0)">
					<text :class="{tabco:tabs==0}">推荐</text>
				</view>
				<view class="box-b" @click="tabClick(1)">
					<text :class="{tabco:tabs==1}">热歌榜</text>
				</view>
				<view class="box-c" @click="tabClick(2)">
					<text :class="{tabco:tabs==2}">歌手</text>
				</view>
			</view>
		</view>
		<!-- 推荐内容 -->
		<view class="tj-content" v-if="tabs==0">
			<!-- 轮播 -->
			<view class="uni-padding-wrap">
				<view class="page-section swiper">
					<view class="page-section-spacing">
						<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
							<swiper-item v-for="(item,index) in lunbo" class="picc" :key="item">
								<image :src="item.picUrl"></image>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			<view class="conten-box">
				<!-- 推荐 -->
				<view class="box1">
					<view class="text-t" @click="gedan">
						推荐歌单<image src="../../static/next.png" class="back"></image>
					</view>
					<view class="pic-box">
						<view class="b-box" v-for="(item,index) in tjpic" :key="item" @click="part(item)">
							<view class="img-box">
								<image :src="item.picUrl"></image>
								<text class="poss">
									{{Math.round(item.playCount/10000)}}万
								</text>
							</view>
							<view class="b-box-text">{{item.name}}</view>
						</view>
					</view>
				</view>
				<!-- 排行榜 -->
				<view class="box2">
					<view class="text-t" @click="tops">排行榜<image src="../../static/next.png" class="back"></image>
					</view>
					<view class="pic-box">
						<view class="b-box" v-for="(item,index) in top" :key="item" @click="songs(item)">
							<view class="img-box">
								<image :src="item.coverImgUrl"></image>
								<text class="poss">
									{{Math.round(item.playCount/10000)}}万
								</text>
							</view>
							<view class="b-box-text">{{item.name}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 热歌榜内容 -->
		<view class="rg-content" v-if="tabs==1">
			<view class="rg-pic">
				<image :src="rgpic"></image>
			</view>
			<view class="rg-texts">
				<view class="rg-text" v-for="(item,index) in rgid" :key="item">
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

		<!-- 歌手 -->
		<view class="gs-content" v-if="tabs== 2">
			<view class="host">
				<text class="host-text">热门</text>
			</view>
			<view class="host-box">
				<view class="box-box" :key="item" v-for="(item,index) in gstop">
					<image :src="item.img1v1Url" class="host-pic"></image>
					<view class="host-name">{{item.name}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//tab
				tabs: 0,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				// 推荐
				lunbo: [],
				tjpic: [],
				top: [],
				num: "",
				// 热歌榜
				rgpic: "",
				rgid: "",
				//热门歌手
				gstop: "",
				//搜索
				show: false,
				shows: false,
				hosts: "",
				input: "",
				hostall: "",
				conunt:"",
				//传值
				songsid: "",
				songsname: "",
				allsong:[],
				ids:[],
				index:""
			}
		},
		onLoad() {
			// 轮播图
			uni.request({
				url: 'http://musicapi.leanapp.cn/banner?type=2',
				success: (res) => {
					this.lunbo = res.data.banners
				}
			})
			//推荐
			uni.request({
				url: 'http://musicapi.leanapp.cn/personalized?limit=6',
				success: (res) => {
					this.tjpic = res.data.result
				}

			})
			//排行榜
			uni.request({
				url: 'http://musicapi.leanapp.cn/toplist/detail',
				success: (res) => {
					this.top = res.data.list.slice(6, 12)
				}
			})
			// 热歌榜
			uni.request({
				url: 'http://musicapi.leanapp.cn/playlist/detail?id=3778678',
				success: (res) => {
					this.rgpic = res.data.playlist.coverImgUrl
					this.rgid = res.data.playlist.tracks
					this.conunt = res.data.playlist.subscribedCount
					this.allsong = res.data.privileges
					for (let i = 0; i < this.allsong.length; i++) {
						this.ids.push(this.allsong[i].id)
					}
					
				}
			})
			// 热门歌手
			uni.request({
				url: 'http://musicapi.leanapp.cn/top/artists?offset=0&limit=10',
				success: (res) => {
					this.gstop = res.data.artists
				}
			})
			// 热搜列表
			uni.request({
				url: 'http://musicapi.leanapp.cn/search/hot',
				success: (res) => {
					this.hosts = res.data.result.hots
				}
			})
		},
		methods: {
			//搜索
			search() {},
			// 推荐歌单
			gedan() {
				uni.navigateTo({
					url: '../song/song'
				})
			},
			//排行榜
			tops() {
				uni.navigateTo({
					url: '../top/top'
				})
			},
			//返回上一层
			tabClick(index) {
				this.tabs = index
			},
			//歌单详情
			part(e) {
				uni.navigateTo({
					url: '../songs/songs?id=' + e.id + '&alls=' + e.trackCount + ''
				})
			},
			//榜单详情
			songs(e) {
				uni.navigateTo({
					url: '../tops/tops?id=' + e.id + '&alls=' + e.trackCount + '&sub=' + e.subscribedCount + ''
				})
			},
			cus() {
				this.show = true
			},
			blur() {
				this.show = false
				this.shows = false
			},
			jianpan(e) {
				this.show = false
				this.shows = true
				this.input = e.detail.value
				if (this.input != "") {
					uni.request({
						url: 'http://musicapi.leanapp.cn/search/suggest?keywords=' + this.input + '',
						success: (res) => {
							this.hostall = res.data.result.songs
						}
					})
				} else {
					this.shows = false
				}
			},
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
			}
		}
	}
</script>

<style>
	/* 导航栏样式 */
	.status_bar {
		height: 140rpx;
		width: 100%;
		background: #31C27C;
		position: relative;
	}

	.top-box {
		width: 560rpx;
		margin-left: 60rpx;
		height: auto;
		padding-top: 56rpx;
		position: relative;
	}

	.btn {
		width: 50rpx;
		height: 56rpx;
		position: absolute;
		right: 160rpx;
		top: 58rpx;
		font-size: 24rpx;
		color: #555555;
		z-index: 999;
		line-height: 54rpx;
	}

	.inp {
		width: 400rpx;
		border: 1px solid #ccc;
		border-radius: 15px;
		background: #F8F8F8;
		color: #555555;
		font-size: 24rpx;
		padding-left: 20rpx;
	}

	.list,
	.lists {
		width: 400rpx;
		height: 400rpx;
		border: 1px solid #ccc;
		position: absolute;
		left: 70rpx;
		top: 115rpx;
		z-index: 999;
		background: #FFFFFF;
	}

	.list-title,
	.list-titles {
		display: block;
		width: 100%;
		height: 60rpx;
		font-size: 24rpx;
		color: ;
		line-height: 60rpx;
		text-indent: 2em;
	}

	.list-titles {
		height: 50rpx;
		line-height: 50rpx;
		background: #F5F5F7;
	}

	.list-host {
		width: 92%;
		height: 200rpx;
		margin: auto;

	}

	.list-hosts {
		width: 100%;
		height: auto;
		height: 200rpx;
	}

	.list-box {
		width: auto;
		padding: 0px 10rpx;
		border-radius: 15px;
		background: #ccc;
		color: #808080;
		font-size: 22rpx;
		float: left;
		margin: 10rpx 10rpx;
	}

	.list-boxs {
		width: 100%;
		height: 60rpx;
		margin: auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.list-boxs text {
		margin: 0px 10rpx;
		font-size: 22rpx;
		height: 40rpx;
	}

	.list-boxs-text1,
	.list-boxs-text2 {
		display: inline-block;
		padding-top: 10rpx;
		width: 160rpx;
		height: 40rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 40rpx;
		text-align: center;
	}

	.list-boxs-text1 {
		text-align: right;
	}

	.list-boxs-text2 {
		text-align: left;
	}

	.list-boxs text:hover {
		background: #EEEEEE;
	}

	/* tab切换样式 */
	.tab-box {
		width: 100%;
		height: 100rpx;
		margin-bottom: 4rpx;
	}

	.back {
		width: 40rpx;
		height: 40rpx;
		display: inline-block;
		position: absolute;
		right: 0rpx;
		top: -2rpx;
	}

	.tab-wid {
		display: flex;
		justify-content: space-between;
	}

	.box-a,
	.box-b,
	.box-c {
		width: 250rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 30rpx;
		color: #968F88;
	}

	.tabco {
		border-bottom: 2px solid red !important;
		width: 100rpx;
		height: 100rpx;
		display: inline-block;
	}

	.tab-wid text {
		display: inline-block;
		border-bottom: 2px solid #FFFFFF;
		width: 100rpx;
		height: 100rpx;
	}




	.swiper {
		width: 100%;
		height: 330rpx;
	}

	.picc image {
		width: 100%;
		height: 330rpx;
	}

	.conten-box {
		width: 95%;
		height: 800rpx;
		margin: auto;
		margin-top: 10rpx;
	}


	.text-t {
		font-size: 26rpx;
		width: 140rpx;
		height: 20px;
		display: block;
		position: relative;
	}

	.pic-box {
		width: 100%;
		height: 660rpx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-top: 20rpx;
	}

	.poss {
		position: absolute;
		right: 12rpx;
		top: 6rpx;
		font-size: 22rpx;
		color: #FFFFFF;
	}

	.b-box {
		width: 230rpx;
		height: auto;
	}

	.img-box {
		width: 230rpx;
		height: 230rpx;
		border-radius: 5px;
		overflow: hidden;
		position: relative;
	}

	.b-box image {
		width: 230rpx;
		height: 230rpx;
	}

	.b-box-text {
		font-size: 20rpx;
		line-height: 35rpx;
		margin-top: 10rpx;
	}

	/* 热歌榜 */
	.rg-pic {
		width: 100%;
		height: 440rpx;
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

	.rg-pic image {
		width: 100%;
		height: 440rpx;
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
	}

	.rg-name {
		width: 100%;
		height: 50rpx;
		display: block;
		font-size: 33rpx;
		margin-top: 27rpx;
	}

	.rg-uname {
		width: 100%;
		height: 50rpx;
		font-size: 25rpx;
		color: #939397;
	}

	.rg-right {
		float: left;
		width: 111rpx;
		height: 120rpx;
	}

	.begin {
		width: 50rpx;
		height: 50rpx;
		display: inline-block;
	}

	.rg-right-box {
		text-align: center;
		width: 100%;
		height: 120rpx;
		line-height: 150rpx;
	}

	/* 热门歌手 */
	.host-text {
		display: block;
		background: #D9DADB;
		color: #FFFFFF;
		width: 100%;
		height: 38rpx;
		font-size: 23rpx;
		text-indent: 1em;
		line-height: 38rpx;
	}

	.host-box {
		width: 100%;
		height: 600px;
		background: #F2F3F4;
		padding-top: 20rpx;
	}

	.box-box {
		width: 98%;
		height: 110rpx;
		margin: auto;
		border-bottom: 1px solid #ccc;
	}

	.host-pic {
		display: inline-block;
		width: 90rpx;
		height: 90rpx;
		float: left;
		margin-top: 10rpx;
	}

	.host-name {
		display: inline-block;
		width: 635rpx;
		float: left;
		color: #454646;
		font-size: 25rpx;
		line-height: 110rpx;
		text-indent: 1.5em;
	}










	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.uni-bg-red {
		background-color: sienna;
		width: 100%;
		height: 300rpx;
	}
</style>
