/*
 * @Description:
 * @Version: 1.0
 * @Autor: 朱峰
 * @Date: 2021-08-07 14:24:43
 * @LastEditors: 朱峰
 * @LastEditTime: 2021-08-11 17:05:53
 */

(function(window) {
    function getTemplate(url) {
        return `<video
                    class='em_video_object'
                    src='${url}'
                >
                </video>`;
    }

    function MkVideo(options) {
        Event.call(this);
        this.$el = $(getTemplate(options.url));
        this._init();
    }

    MkVideo.prototype = Object.assign({
        _init: function() {
            this._bindEvent();
        },
        _bindEvent: function() {
            var self = this;
            this.$el[0].addEventListener('waiting', function(e) {
                // console.log('================== waiting:', e, `++++duration:${this.duration}`);
            });
            this.$el[0].addEventListener('loadeddata', function(e) {
                console.log('================== mk_video loadeddata:', e, `++++duration:${this.duration}`);
                self.trigger('loadeddata', e);
            });
            this.$el[0].addEventListener('canplay', function(e) {
                // console.log('================== canplay:', e, `++++duration:${this.duration}`);
            });
            this.$el[0].addEventListener('complete', function(e) {
                // console.log('================== complete:', e, `++++duration:${this.duration}`);
            });
            this.$el[0].addEventListener('durationchange', function(e) {
                // console.log('================== durationchange:', e, `++++duration:${this.duration}`);
            });
            this.$el[0].addEventListener('ended', function(e) {
                // console.log('================== ended:', e, `++++duration:${this.duration}`);
            });
            this.$el[0].addEventListener('emptied', function(e) {
                // console.log('================== emptied:', e, `++++duration:${this.duration}`);
            });

            // 播放事件
            this.$el[0].addEventListener('play', function(e) {
                // console.log('================== play:', e, `++++duration:${this.duration}`);
                self.trigger('play', e);
            });
            this.$el[0].addEventListener('pause', function(e) {
                // console.log('================== pause:', e, `++++duration:${this.duration}`);
                self.trigger('pause', e);
            });
            this.$el[0].addEventListener('playing', function(e) {
                // console.log('================== playing:', e, `++++duration:${this.duration}`);
                self.trigger('playing', e);
            });
            this.$el[0].addEventListener('progress', function(e) {
                // console.log('================== progress:', e, `++++duration:${this.duration}`);
                self.trigger('progress', e);
            });
            this.$el[0].addEventListener('timeupdate', function(e) {
                // console.log('================== timeupdate:', e, `++++duration:${this.duration}++++++currentTime:${this.currentTime}`);
                self.trigger('timeupdate', e);
            });
            this.$el[0].addEventListener('ended', function(e) {
                console.log('================== ended:', e, `++++duration:${this.duration}`);
                self.trigger('ended', e);
            });
            this.$el[0].addEventListener('volumechange', function(e) {
                // console.log('===================== volumechange', this.volume);
                self.trigger('volumechange', this.volume);
            });
            this.$el[0].addEventListener('ratechange', function(e) {
                // console.log('===================== volumechange', this.volume);
                self.trigger('ratechange', this.playbackRate);
            });

        },

        // 播放
        play: function() {
            this.$el[0].play();
        },
        // 暂停
        pause: function() {
            this.$el[0].pause();
        },

        setPercent(percent) {
            var duration = this.$el[0].duration;
            if (!duration) {
                return;
            }

            var currentTime = parseFloat(duration * percent / 100).toFixed(markerVideoConfig.precision);
            this.$el[0].currentTime = currentTime;
        },

        setVolumePercent(percent) {
            this.$el[0].volume = percent / 100;
        },

        setRate(rate) {
            this.$el[0].playbackRate = rate;
        },

        checkIsPaused() {
            return this.$el[0].paused;
        },

        checkIsMuted() {
            return this.$el[0].muted;
        },

        setMuted(isMuted) {
            this.$el[0].muted = isMuted;
        },

        getCurrentTime() {
            return this.$el[0].currentTime;
        },

        setCurrentTime(currentTime) {
            !currentTime && (currentTime = 0);
            return this.$el[0].currentTime = currentTime;
        },

        render: function($parent) {
            $parent.append(this.$el);
        }
    }, Event.prototype);

    MkVideo.prototype.constructor = MkVideo;

    window.MkVideo = MkVideo;
})(window);