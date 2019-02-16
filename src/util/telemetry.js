// @flow

import { extend, bindAll } from '../util/util';
import { postData } from '../util/ajax';

const defaultOptions = {
    flushAt: 20,
    flushAfter: 10000
};

const telemetryURL = 'http://localhost:8000/events';

export type TelemetryOptions = {
    flushAt?: number,
    flushAfter?: number
};

class Telemetry {
    options: TelemetryOptions;
    _registry: array;
    _timer: number;

    constructor(options: TelemetryOptions) {
        bindAll([
          '_flush'
        ], this);

        this.options = extend(defaultOptions, options);
        this._registry = [];
        // if (this.options.flushAfter) {
        //     this._timer = setInterval(this._flush, this.options.flushAfter);
        //     console.log('timer set', this._timer);
        // }
    }

    push(event: string, payload: any) {
        this._registry.push({event, payload});
        console.log('event added to _registry', this._registry);
        if (this._registry.length === this.options.flushAt) {
            this._flush();
        }
    }

    _flush() {
        console.log('flushing event _registry', this._registry);
        const events = [];
        while(this._registry.length) {
          events.push(this._registry.shift());
        }
        if (events.length) {
          postData({url: telemetryURL, body: JSON.stringify(events)}, (err, data) => {
            if (err) console.log('err', err);

            console.log('data', data);
          });
        }
        console.log('_registry flushed', this._registry);
    }
}

export default Telemetry;
