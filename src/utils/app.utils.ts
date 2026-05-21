import { randomBytes } from "crypto";
import moment from "moment";

export const generateUniqueId = (prefix: string) => {
    return `${prefix}${randomBytes(4).toString('hex')}${moment().unix()}`;
};

export const dateToTimestamp = (date: Date | number) => {
    if (!date) return null;
    return moment.utc(date).valueOf();
};