/*
 * @Description:
 * @Version: 1.0
 * @Autor: 朱峰
 * @Date: 2021-08-07 14:24:43
 * @LastEditors: 朱峰
 * @LastEditTime: 2021-08-11 17:04:52
 */

(function(window) {
    function getTemplate() {
        return `<div class='em_full_screen_btn_content'>
                    <div id='fullScreenButton' class='full_screen_btn'>
                        <i class='iconfont icon-quanping'></i>
                    </div>
                </div>`;
    }

    function PlayButton() {
        Event.call(this);
        this.$el = $(getTemplate());
        this._init();
    }

    PlayButton.prototype = Object.assign({
        _init: function() {
            this._bindEvent();
        },
        _bindEvent: function() {
            var self = this;
            this.$el.on('click', '#playButton', function(e) {
                self.trigger('play');
            });
            this.$el.on('click', '#pauseButton', function(e) {
                self.trigger('pause');
            });
        },
        setPlay() {
            this.$el.find('#playButton').hide();
            this.$el.find('#pauseButton').show();
        },
        setPause() {
            this.$el.find('#pauseButton').hide();
            this.$el.find('#playButton').show();
        },
        render: function($parent) {
            $parent.append(this.$el);
        }
    }, Event.prototype);

    PlayButton.prototype.constructor = PlayButton;

    window.PlayButton = PlayButton;
})(window);