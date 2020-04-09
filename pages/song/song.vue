<template>
	<view>
		<view class="status_bar">
			<view class="top-box">
				<view class="homes" @click="back()">
					<image src="../../static/返回%20.png" class="back">
				</view>
				<view class="titles">
					<text class="titles-text">歌单</text>
				</view>
			</view>
		</view>    
		<view class="conten-box">
			<view class="box1">
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
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				lunbo: [],
				tjpic: [],
				top: [],
				num: ""
			}
		},
		onLoad() {
			uni.request({
				url: 'http://musicapi.leanapp.cn/personalized',
				success: (res) => {
					this.tjpic = res.data.result
				}
			})
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			//歌单详情
			part(e) {
				uni.navigateTo({
					url: '../songs/songs?id=' + e.id + '&alls=' + e.trackCount + ''
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

	.conten-box {
		width: 95%;
		height: 800rpx;
		margin: auto;
		margin-top: 10rpx;
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
		height: 280rpx;
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
</style>
