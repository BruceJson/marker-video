/*
 * @Description:
 * @Version: 1.0
 * @Autor: 朱峰
 * @Date: 2021-08-07 14:24:43
 * @LastEditors: 朱峰
 * @LastEditTime: 2021-08-11 17:07:46
 */

(function(window) {
    function getTemplate() {
        return `<div class='em_speed_btn_content'>
                    <div id='speedButton' class='speed_btn'>
                        <p id='speed_text'>1.0X</p>
                    </div>

                    <div class='em_speed_setting_box'>
                        <div class='speed_setting_box_inner'>
                            <p class='speed_setting_item' speed='2'>2.0X</p>
                            <p class='speed_setting_item' speed='1.5'>1.5X</p>
                            <p class='speed_setting_item' speed='1.25'>1.25X</p>
                            <p class='speed_setting_item' speed='1'>1.0X</p>
                            <p class='speed_setting_item' speed='0.5'>0.5X</p>
                        </div>
                    </div>
                </div>`;
    }

    function SpeedButton() {
        Event.call(this);
        this.$el = $(getTemplate());
        this._init();
    }

    SpeedButton.prototype = Object.assign({
        _init: function() {
            this._bindEvent();
        },
        _bindEvent: function() {
            var self = this;
            this.$el.on('click', '.speed_setting_item', function(e) {
                self.trigger('rate-change', this.getAttribute('speed'));
            });
            this.$el.on('click', '#pauseButton', function(e) {
                self.trigger('pause');
            });
        },
        setRate(rate) {
            this.$el.find('.speed_setting_item').removeClass('active');
            var $activeSpeedItem = this.$el.find(`.speed_setting_item[speed='${rate}']`);
            $activeSpeedItem.addClass('active');
            this.$el.find(`#speed_text`).text($activeSpeedItem.text());
        },
        render: function($parent) {
            $parent.append(this.$el);
        }
    }, Event.prototype);

    SpeedButton.prototype.constructor = SpeedButton;

    window.SpeedButton = SpeedButton;
})(window);