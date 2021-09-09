/*
 * @Description:
 * @Version: 1.0
 * @Autor: 朱峰
 * @Date: 2021-08-07 13:42:14
 * @LastEditors: 朱峰
 * @LastEditTime: 2021-08-11 17:06:44
 */
(function(window) {
    function getTemplate() {
        return `<div class='em_progress_box'>
                    <div class='progress_bar'>
                        <div class='progress_bar_inner'>
                            <div class='progress_bar_thumb'></div>
                        </div>
                        <div class='progress_mark_list'>
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

    function getDomOffsetX(targetEl, baseEl) {
        if (!baseEl) {
            baseEl = document.body;
        }
        if (!targetEl || targetEl === baseEl) {
            return 0;
        } else {
            var _parentEl = targetEl.offsetParent;
            var _offsetX = targetEl.offsetLeft + getDomOffsetX(_parentEl, baseEl);
            return _offsetX;
        }
    }

    function progressBarClickOffsetXPercent(event, baseEl) {
        var baseElWidth = baseEl.offsetWidth;
        var eventOffsetX = event.offsetX;

        var domOffsetX = getDomOffsetX(event.target, baseEl);

        // console.log('================= domOffsetX', domOffsetX, eventOffsetX);

        if (event.target.className.indexOf('progress_mark') > -1) {
            // 如果点击的是 marker
            return parseFloat((domOffsetX / baseElWidth) * 100).toFixed(markerVideoConfig.precision);
        }

        if (event.target.className.indexOf('progress_bar_thumb') > -1) {
            return parseFloat(((domOffsetX + (eventOffsetX - 6) + 20) / baseElWidth) * 100).toFixed(markerVideoConfig.precision);
        } else {
            return parseFloat(((domOffsetX + eventOffsetX) / baseElWidth) * 100).toFixed(markerVideoConfig.precision);
        }
    }

    function ProgressBar(options) {
        Event.call(this);
        this.currentTime = 0;
        this.duration = 0;
        this.$el = $(getTemplate());

        // 拖动
        this.isDrag = false;
        this.progressBarOffsetX = null;
        this.progressBarWidth = null;

        this.markerList = options.markerList || [];
        this._init();
    }

    ProgressBar.prototype = Object.assign({
        _init: function() {
            this._bindEvent();
        },

        _bindEvent: function() {
            var self = this;
            this.$el.on('click', '.progress_bar', function(e) {
                // console.log(e);
                var _clickPercent = progressBarClickOffsetXPercent.call(self, e.originalEvent, this);
                self.trigger('progress-change', _clickPercent);
            });

            this.$el.on('mousedown', '.progress_bar_thumb', function(e) {
                e.stopPropagation();
                // console.log('========================= progress mousedown', e.originalEvent);
                self.progressBarOffsetX = getDomOffsetX(self.$el.find('.progress_bar')[0]);
                self.progressBarWidth = self.$el.find('.progress_bar')[0].offsetWidth;
                self.isDrag = true;
            });
            $(window).on('mousemove', function(e) {
                e.stopPropagation();
                if (self.isDrag) {
                    var _percent = parseFloat((e.pageX - self.progressBarOffsetX) / self.progressBarWidth).toFixed(markerVideoConfig.precision) * 100;
                    _percent = _percent > 100 ? 100 : _percent;
                    _percent = _percent < 0 ? 0 : _percent;
                    // console.log('========================= progress mousemove', e.originalEvent, e.pageX - self.progressBarOffsetX, self.progressBarWidth, _percent);
                    self.trigger('progress-change', _percent);
                }
            });
            $(window).on('mouseup', function(e) {
                e.stopPropagation();
                if (self.isDrag) {
                    // console.log('========================= progress mouseup', e.originalEvent);
                    self.isDrag = false;
                }
                self.progressBarOffsetX = null;
                self.progressBarWidth = null;
            });

            this.$el.on('click', '.mark_tip_box', function(e) {
                e.stopPropagation();
            });
        },

        _setPercent: function(percent) {
            this.$el.find('.progress_bar_inner').css({ 'width': `${percent}%` });
        },

        // 初始化marker 列表
        _initMarkerList: function() {
            var $progressMarkList = this.$el.find('.progress_mark_list');
            $progressMarkList.children().remove();
            for (var i = 0; i < this.markerList.length; i++) {
                var _marker = this.markerList[i];
                var _percent = calcPercent(_marker.time, this.duration);
                var $marker = $(`<div class='progress_mark'><div class='mark_tip_box'><p style='white-space: nowrap;'>${_marker.label}</p></div></div>`).css('left', `${_percent}%`);
                $progressMarkList.append($marker);
            }
        },

        setMarkerList: function(markerList) {
            this.markerList = markerList || [];
            this._initMarkerList();
        },

        setDuration: function(duration) {
            this.duration = duration || 0;
            var self = this;

            // 设置完总时长后，理论上来说要重置一下marker
            setTimeout(function() {
                self._initMarkerList();
            });
        },
        setCurrentTime: function(currentTime) {
            this.currentTime = currentTime;
            var percent = calcPercent(currentTime, this.duration);
            this._setPercent(percent);
        },
        render($parent) {
            $parent.append(this.$el);
        }
    }, Event.prototype);

    ProgressBar.prototype.constructor = ProgressBar;

    window.ProgressBar = ProgressBar;
})(window);