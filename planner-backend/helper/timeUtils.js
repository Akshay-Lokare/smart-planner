/**
 * Converts duration strings like:
 * PT05      -> 5 minutes
 * PT5M      -> 5 minutes
 * PT2H      -> 2 hours
 * PT1H30M   -> 90 minutes
 * PT30S     -> 30 seconds
 *
 * Returns milliseconds
 */

const parseDuration = (duration) => {

    // Validate input:
    // - duration must exist
    // - duration must start with "PT"
    if (!duration || !duration.startsWith("PT")) {
        throw new Error("Invalid duration format");
    }

    // Remove the "PT" prefix to work only with the time portion
    // Example: "PT1H30M" -> "1H30M"
    const time = duration.slice(2);

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    // Match hours if present (e.g., "2H")
    const hourMatch = time.match(/(\d+)H/);

    // Match minutes if present (e.g., "30M")
    const minuteMatch = time.match(/(\d+)M/);

    // Match seconds if present (e.g., "45S")
    const secondMatch = time.match(/(\d+)S/);

    // Convert them from string to number
    if (hourMatch) hours = parseInt(hourMatch[1], 10);
    if (minuteMatch) minutes = parseInt(minuteMatch[1], 10);
    if (secondMatch) seconds = parseInt(secondMatch[1], 10);

    // If no unit (H/M/S) is specified, assume the value is in minutes
    // Example: "PT05" -> 5 minutes
    if (!hourMatch && !minuteMatch && !secondMatch) {
        minutes = parseInt(time, 10);
    }

    // Convert all units to milliseconds and return the total
    return (
        hours * 60 * 60 * 1000 +   // hours -> ms
        minutes * 60 * 1000 +      // minutes -> ms
        seconds * 1000             // seconds -> ms
    );
};


module.exports = { parseDuration };
