/*
 * @Description:
 * @Version: 1.0
 * @Autor: 朱峰
 * @Date: 2021-08-07 14:24:43
 * @LastEditors: 朱峰
 * @LastEditTime: 2021-08-07 16:24:05
 */

(function(window) {
    function getTemplate() {
        return `<div class='speed_btn_content'>
                    <div id='speedButton' class='speed_btn'>
                        <p>1.0X</p>
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