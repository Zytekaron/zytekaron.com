const truth = {
    "0": false,
    "1": true,
    "false": false,
    "true": true,
    "no": false,
    "yes": true,
};

export default function (str) {
    return truth[str?.toLowerCase()] ?? "false";
}
