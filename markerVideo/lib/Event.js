/*
 * @Description:
 * @Version: 1.0
 * @Autor: 朱峰
 * @Date: 2021-08-07 14:26:50
 * @LastEditors: 朱峰
 * @LastEditTime: 2021-08-07 16:02:18
 */
(function(window) {
    function Event() {
        this.eventPool = {};
    }

    Event.prototype = {
        addEventListener: function(eventName, callback) {
            !this.eventPool[eventName] && (this.eventPool[eventName] = []);
            this.eventPool[eventName].push(callback);
        },
        trigger: function(eventName) {
            var self = this;
            var params = Array.from(arguments);
            this.eventPool[eventName] && this.eventPool[eventName].length && this.eventPool[eventName].forEach(function(cb) {
                cb.apply(self, params);
            });
        }
    };

    Event.prototype.constructor = Event;
    window.Event = Event;
})(window);