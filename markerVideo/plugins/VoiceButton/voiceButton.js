/*
 * @Description:
 * @Version: 1.0
 * @Autor: 朱峰
 * @Date: 2021-08-07 14:24:43
 * @LastEditors: 朱峰
 * @LastEditTime: 2021-08-11 17:10:16
 */
function getDomOffsetY(targetEl, baseEl) {
    if (!baseEl) {
        baseEl = document.body;
    }
    if (!targetEl || targetEl === baseEl) {
        return 0;
    } else {
        var _parentEl = targetEl.offsetParent;
        var _offsetY = targetEl.offsetTop + getDomOffsetY(_parentEl, baseEl);
        return _offsetY;
    }
}

(function(window) {
    function getTemplate() {
        return `<div class='em_voice_btn_content'>
                    <div id='voiceButton' class='voice_btn'>
                        <i class='iconfont icon-yinliang'></i>
                    </div>

                    <div class='em_voice_setting_box'>
                        <div class='voice_setting_box_inner'>
                            <div class='em_voice_setting_progress_bar'>
                                <div class='voice_setting_progress_inner'>
                                    <div class='voice_thumb'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    function calcPercent(currentTime, duration) {
        if (!duration) {
            return 0;
        } else {
            return parseFloat((currentTime / duration) * 100).toFixed(markerVideoConfig.precision);
        }
    }



    function progressBarClickOffsetYPercent(event, baseEl) {
        var baseElHeight = baseEl.offsetHeight;
        var eventOffsetY = event.offsetY;

        var domOffsetY = getDomOffsetY(event.target, baseEl);

        // console.log('================= domOffsetY', domOffsetY, eventOffsetY);

        var totalOffsetY;
        if (event.target.className.indexOf('voice_setting_progress_bar') > -1) {
            totalOffsetY = eventOffsetY;
        } else if (event.target.className.indexOf('voice_setting_progress_inner') > -1) {
            totalOffsetY = domOffsetY + eventOffsetY;
        } else {
            totalOffsetY = domOffsetY + (eventOffsetY - 4);
        }
        // console.log('================= totalOffsetY', totalOffsetY);
        return parseFloat(((baseElHeight - totalOffsetY) / baseElHeight) * 100).toFixed(markerVideoConfig.precision);
    }

    function VoiceButton() {
        Event.call(this);
        this.$el = $(getTemplate());

        this.isDrag = false;
        this.progressBarOffsetY = null;
        this.volumeBarHeight = null;

        this._init();
    }

    VoiceButton.prototype = Object.assign({
        _init: function() {
            this._bindEvent();
        },
        _bindEvent: function() {
            var self = this;
            this.$el.on('click', '.voice_setting_progress_bar', function(e) {
                // console.log(e);
                var _clickPercent = progressBarClickOffsetYPercent.call(self, e.originalEvent, this);
                self.trigger('volume-change', _clickPercent);
            });

            this.$el.on('mousedown', '.voice_thumb', function(e) {
                e.stopPropagation();
                self.isDrag = true;
                self.progressBarOffsetY = getDomOffsetY(self.$el[0]) - self.$el.find('.voice_setting_box')[0].offsetHeight + 15;
                self.volumeBarHeight = self.$el.find('.voice_setting_progress_bar')[0].offsetHeight;
                // console.log('========================= volume mousedown', e.originalEvent, self.progressBarOffsetY);
            });
            $(window).on('mousemove', function(e) {
                e.stopPropagation();
                if (self.isDrag) {
                    var _percent = parseFloat((self.volumeBarHeight - (e.originalEvent.pageY - self.progressBarOffsetY)) / self.volumeBarHeight).toFixed(markerVideoConfig.precision) * 100;
                    _percent = _percent > 100 ? 100 : _percent;
                    _percent = _percent < 0 ? 0 : _percent;
                    // console.log('============================ volume mouse move', _percent, e.originalEvent.pageY, self.progressBarOffsetY);
                    self.trigger('volume-change', _percent);
                }
            });
            $(window).on('mouseup', function(e) {
                e.stopPropagation();
                if (self.isDrag) {
                    // console.log('========================= volume mouseup', e.originalEvent);
                    self.isDrag = false;
                }
                self.progressBarOffsetY = null;
                self.volumeBarHeight = null;
            });

            this.$el.find('.voice_btn').click(function(e) {
                e.stopPropagation();
                self.trigger('volume-button-click');
            });
        },
        setVolume: function(volumn) {
            this.$el.find('.voice_setting_progress_inner').css('height', `${volumn * 100}%`);

            if (volumn == 0) {
                this.$el.find('.voice_btn i').removeClass('icon-yinliang').addClass('icon-jingyin');
            } else {
                this.$el.find('.voice_btn i').removeClass('icon-jingyin').addClass('icon-yinliang');
            }
        },
        render: function($parent) {
            $parent.append(this.$el);
        }
    }, Event.prototype);

    VoiceButton.prototype.constructor = VoiceButton;

    window.VoiceButton = VoiceButton;
})(window);