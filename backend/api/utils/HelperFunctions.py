from datetime import timedelta


def format_time(time):
    if not time:
        return None
    if time == timedelta(days=200):
        return "NT"
    elif time == timedelta(days=300):
        return "NS"
    elif time == timedelta(days=400):
        return "DQ"

    parts = str(time).split(":")
    formatted_time = []

    if len(parts) == 3:
        # HH:MM:SS.ms
        hours = int(parts[0])
        minutes = int(parts[1])
        seconds, ms = (parts[2].split(".") + ["00"])[:2]

        if hours > 0:
            formatted_time.append(str(hours).zfill(2))
        formatted_time.append(str(minutes).zfill(2))
        formatted_time.append(
            f"{str(seconds).zfill(2)}.{ms.ljust(2, '0')[:2]}")

    elif len(parts) == 2:
        # MM:SS.ms
        minutes = int(parts[0])
        seconds, ms = (parts[1].split(".") + ["00"])[:2]

        if minutes > 0:
            formatted_time.append(str(minutes).zfill(2))
        formatted_time.append(
            f"{str(seconds).zfill(2)}.{ms.ljust(2, '0')[:2]}")

    else:
        raise ValueError("Invalid time format")

    return ":".join(formatted_time)
