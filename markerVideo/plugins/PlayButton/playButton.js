/*
 * @Description:
 * @Version: 1.0
 * @Autor: 朱峰
 * @Date: 2021-08-07 14:24:43
 * @LastEditors: 朱峰
 * @LastEditTime: 2021-08-11 17:06:16
 */

(function(window) {
    function getTemplate() {
        return `<div class='em_play_btn_content'>
                    <div id='playButton' class='play_btn play'>
                        <i class='iconfont icon-bofang'></i>
                    </div>
                    <div id='pauseButton' class='play_btn pause'>
                        <i class='iconfont icon-zantingtingzhi'></i>
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