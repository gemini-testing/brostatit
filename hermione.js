'use strict';

const lib = require('./lib');

module.exports = (hermione, options) => {
    options = lib.parseConfig(options);

    if (!options.enabled) {
        return;
    }

    const events = hermione.events;
    const stat = new lib.Stat();

    hermione.on(events.SESSION_START, (session) => stat.markStartBrowserTime(session.browserId));
    hermione.on(events.SESSION_END, (session) => stat.markEndBrowserTime(session.browserId));

    hermione.on(events.TEST_FAIL, (data) => stat.addFailed(data.browserId));
    hermione.on(events.TEST_PASS, (data) => stat.addPassed(data.browserId));
    hermione.on(events.TEST_PENDING, (data) => stat.addSkipped(data.browserId));

    hermione.on(events.RETRY, (data) => stat.addRetry(data.browserId));

    hermione.on(events.RUNNER_END, () => lib.showReport(stat.getStatistic(), options));
};
