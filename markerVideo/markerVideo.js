/*
 * @Description:
 * @Version: 1.0
 * @Autor: 朱峰
 * @Date: 2021-08-07 14:24:43
 * @LastEditors: 朱峰
 * @LastEditTime: 2021-08-11 17:02:50
 */

(function(window) {
    function numTo2(num) {
        !num && (num = 0);
        var numStr = num + '';
        return numStr.length === 1 ? `0${numStr}` : numStr;
    }

    function getTemplate() {
        return `<div class='em_video_marker mark_video_box'>
                    <!-- 进度条 -->
                    <div class='video_box'></div>

                    <div class='video_cover_layer'></div>
                    <div class='video_control_layer'>
                        <!-- 进度条 -->
                        <div class='progress_control_box'></div>

                        <!-- 控制按钮 -->
                        <div class='control_btn_box'>
                            <div class='left_content'>
                                <div class='play_btn_box'>
                                </div>

                                <div class='time_box'>
                                    <p class='time_content'>--:--:--/--:--:--</p>
                                </div>
                            </div>

                            <div class='right_content'>
                                <!-- 声音设置 -->
                                <div class='voice_btn_box'></div>

                                <!-- 速度设置 -->
                                <div class='speed_btn_box'></div>

                                <!-- 全屏 -->
                                <div class='full_screen_btn_box'>
                                    <div class='full_screen_btn_content'>
                                        <div id='fullScreenButton' class='full_screen_btn'>
                                            <i class='iconfont icon-quanping'></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    function MarkerVideo(options) {
        Event.call(this);
        this.$el = $(getTemplate());
        this._init(options);
    }

    MarkerVideo.prototype = Object.assign({
        _init: function(options) {
            var self = this;
            this.options = Object.assign({}, options);
            this._initPlugins();
            this._bindEvent();
            setTimeout(function() {
                self._render(options);
            });
        },
        _initPlugins: function() {
            this.markVideo = new MkVideo({ url: this.options.videoUrl });
            this.progressBar = new ProgressBar({ markerList: this.options.markerList || [] });
            this.playButton = new PlayButton();
            this.voiceButton = new VoiceButton();
            this.speedButton = new SpeedButton();
        },
        _bindEvent: function() {
            this._bindMarkerVideoEvent();
            this._bindOtherControlBtnEvent();
            this._bindDomEvent();
        },
        _bindMarkerVideoEvent: function() {
            var self = this;
            // 播放事件
            this.markVideo.addEventListener('loadeddata', function(e) {
                var that = this;
                // console.log('================== loadeddata:', e, `++++duration:${this.$el[0].duration}+++++++++++volume:${this.$el[0].volume}+++++++++++rate:${this.$el[0].playbackRate}`);
                setTimeout(function() {
                    self.progressBar.setDuration(that.$el[0].duration);
                });
                setTimeout(function() {
                    self.voiceButton.setVolume(that.$el[0].volume);
                });
                setTimeout(function() {
                    self.speedButton.setRate(that.$el[0].playbackRate);
                });

                setTimeout(function() {
                    self._setTime(0, that.$el[0].duration);
                });

                setTimeout(function() {
                    self._initPlayControlBox();
                });
            });
            this.markVideo.addEventListener('pause', function(e) {
                // console.log('================== pause:', e, `++++duration:${this.$el[0].duration}`);
                setTimeout(function() {
                    self.playButton.setPause();
                });

                setTimeout(function() {
                    self._initPlayControlBox();
                });
            });
            this.markVideo.addEventListener('playing', function(e) {
                // console.log('================== playing:', e, `++++duration:${this.$el[0].duration}`);
                setTimeout(function() {
                    self.playButton.setPlay();
                });

                setTimeout(function() {
                    self._initPlayControlBox();
                });
            });
            this.markVideo.addEventListener('progress', function(e) {
                // console.log('================== progress:', e, `++++duration:${this.$el[0].duration}`);
            });
            this.markVideo.addEventListener('timeupdate', function(e) {
                // console.log('================== timeupdate:', e, `++++duration:${this.$el[0].duration}++++++currentTime:${this.$el[0].currentTime}`);
                var that = this;
                setTimeout(function() {
                    self._setTime(that.$el[0].currentTime, that.$el[0].duration);
                });

                setTimeout(function() {
                    self.progressBar.setCurrentTime(that.$el[0].currentTime);
                });
            });
            this.markVideo.addEventListener('ended', function(e) {
                // console.log('================== ended:', e, `++++duration:${this.$el[0].duration}++++++currentTime:${this.$el[0].currentTime}`);
                setTimeout(function() {
                    self.playButton.setPause();
                });

                setTimeout(function() {
                    self._initPlayControlBox();
                });
            });
            this.markVideo.addEventListener('volumechange', function(e, volume) {
                // console.log('================== volumechange:', e, volume);
                setTimeout(function() {
                    self.voiceButton.setVolume(self.markVideo.checkIsMuted() ? 0 : volume);
                });
            });
            this.markVideo.addEventListener('ratechange', function(e, rate) {
                // console.log('================== ratechange:', e, rate);
                setTimeout(function() {
                    self.speedButton.setRate(rate);
                });
            });
        },

        _bindOtherControlBtnEvent: function() {
            var self = this;
            // 进度条变化
            this.progressBar.addEventListener('progress-change', function(e, percent) {
                // console.log('===================== progress-change', percent);
                setTimeout(function() {
                    self.markVideo.setPercent(percent);
                });
            });

            // 音量变化
            this.voiceButton.addEventListener('volume-change', function(e, percent) {
                // console.log('===================== volume-change', percent);
                if (percent > 0) {
                    setTimeout(function() {
                        self.markVideo.setMuted(false);
                    });
                }
                setTimeout(function() {
                    self.markVideo.setVolumePercent(percent);
                });
            });

            // 音量按钮点击
            this.voiceButton.addEventListener('volume-button-click', function(e) {
                // console.log('===================== volume-button-click', self.markVideo.checkIsMuted());
                setTimeout(function() {
                    if (self.markVideo.checkIsMuted()) {
                        self.markVideo.setMuted(false);
                    } else {
                        self.markVideo.setMuted(true);
                    }
                });
            });

            // 播放速度
            this.speedButton.addEventListener('rate-change', function(e, rate) {
                // console.log('===================== rate-change', rate);
                self.markVideo.setRate(rate);
            });

            // 播放暂停
            this.playButton.addEventListener('play', function() {
                // console.log('========= play');
                setTimeout(function() {
                    self.markVideo.play();
                });
            });
            this.playButton.addEventListener('pause', function() {
                // console.log('========= pause');
                setTimeout(function() {
                    self.markVideo.pause();
                });
            });

            // 全屏
            this.$el.find('.full_screen_btn').click(function() {
                if (self.$el.hasClass('full_screen')) {
                    $(this).find('i').addClass('icon-quanping');
                    $(this).find('i').removeClass('icon-quxiaoquanping');
                    self.$el.removeClass('full_screen');
                } else {
                    $(this).find('i').addClass('icon-quxiaoquanping');
                    $(this).find('i').removeClass('icon-quanping');
                    self.$el.addClass('full_screen');
                }
            });
        },

        _bindDomEvent: function() {
            var self = this;
            // video_control_layer
            this.$el.find('.video_control_layer').on('click', function(e) {
                e.stopPropagation();
            });

            // video_cover_layer
            this.$el.find('.video_cover_layer').on('click', function(e) {
                e.stopPropagation();
                self.markVideo.checkIsPaused() ? self.markVideo.play() : self.markVideo.pause();
            });
        },

        _setTime(currentTime, duration) {
            !currentTime && (currentTime = 0);

            var hour = Math.floor(currentTime / 3600);
            var minute = Math.floor(currentTime / 60);
            var second = Math.ceil(currentTime % 60);

            var hour_d = Math.floor(duration / 3600);
            var minute_d = Math.floor(duration / 60);
            var second_d = Math.ceil(duration % 60);

            var time = `${numTo2(hour)}:${numTo2(minute)}:${numTo2(second)}/${numTo2(hour_d)}:${numTo2(minute_d)}:${numTo2(second_d)}`;
            var self = this;
            setTimeout(function() {
                self.$el.find('.time_box .time_content').text(time);
            });
        },

        _initPlayControlBox: function() {
            if (this.markVideo.checkIsPaused()) {
                this.$el.find('.video_control_layer').addClass('active');
            } else {
                this.$el.find('.video_control_layer').removeClass('active');
            }
        },

        _setVolumeByVolumeBtnClick: function() {
            if (this.markVideo.checkIsPaused()) {
                this.$el.find('.video_control_layer').addClass('active');
            } else {
                this.$el.find('.video_control_layer').removeClass('active');
            }
        },

        _render: function(options) {
            $(options.el).append(this.$el);
            this.$el.css({
                width: options.width || '100%',
                height: options.height || '100%'
            });

            // video
            this.markVideo.render($('.video_box'));

            // 进度条
            this.progressBar.render($('.progress_control_box'));

            // 声音控制
            this.voiceButton.render($('.voice_btn_box'));

            // 倍速
            this.speedButton.render($('.speed_btn_box'));

            // 播放暂定
            this.playButton.render($('.play_btn_box'));
        },

        play() {
            this.markVideo.play();
        },
        pause() {
            this.markVideo.pause();
        },
        getCurrentTime() {
            return this.markVideo.getCurrentTime();
        },
        setCurrentTime(currentTime) {
            return this.markVideo.setCurrentTime(currentTime);
        },
        setMarkerList(markerList) {
            return this.progressBar.setMarkerList(markerList);
        }
    }, Event.prototype);

    MarkerVideo.prototype.constructor = MarkerVideo;

    window.MarkerVideo = MarkerVideo;
})(window);