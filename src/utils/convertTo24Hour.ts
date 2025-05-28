/* eslint-disable prefer-const */
export const convertTo24Hour = (time: string): string => {
    const [hourMinute, modifier] = time.split(" ");
    let [hours, minutes] = hourMinute.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
        hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
        hours = 0;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
