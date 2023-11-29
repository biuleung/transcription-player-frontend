import moment from "moment";

export function formattedTime(seconds) {
    if (seconds != null) {
        return moment().startOf("day").seconds(seconds).format("mm:ss");
    } else {
        return null;
    }
}

export function formattedTimeToSec(time, format) {
    if (time != null) {
        return moment(time, 'mm:ss').diff(moment().startOf('day'), 'seconds');
    } else {
        return null;
    }

}